import {https, config, pubsub} from "firebase-functions/v1";
import * as admin from "firebase-admin";
import axios from "axios";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Secret management for Tap Payments API Key
const TAP_API_SECRET_KEY = config().tap.secret_key;
const TAP_API_BASE_URL = "https://api.tap.company/v2";

/**
 * Creates a temporary booking for cash payment.
 */
export const createCashBooking = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const {eventId, selectedSeats, totalAmount} = data;
  const userId = context.auth.uid;

  if (!eventId || !selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
    throw new https.HttpsError("invalid-argument", "Missing or invalid required data.");
  }

  const eventRef = db.collection("events").doc(eventId);
  const bookingRef = db.collection("bookings").doc();

  try {
    await db.runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new https.HttpsError("not-found", "Event not found.");
      }

      const eventData = eventDoc.data() as any;
      const newSeatingChart = {...eventData.seatingChart};
      
      // Check if seats are available and mark them as reserved
      for (const seatId of selectedSeats) {
        let seatFound = false;
        for (const row of newSeatingChart.rows) {
          const seat = row.seats.find((s: any) => s.id === seatId);
          if (seat) {
            seatFound = true;
            if (seat.status !== "available") {
              throw new https.HttpsError("failed-precondition", `Seat ${seatId} is no longer available.`);
            }
            seat.status = "reserved"; // Mark as temporarily reserved
            break; // Move to the next selected seat
          }
        }
        if (!seatFound) {
          throw new https.HttpsError("not-found", `Seat ${seatId} does not exist in the seating chart.`);
        }
      }
      
      // Create the booking document
      transaction.set(bookingRef, {
        bookingId: bookingRef.id,
        userId: userId,
        eventId: eventId,
        seats: selectedSeats,
        amount: totalAmount,
        status: "pending_cash",
        paymentMethod: "cash",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update the event seating chart
      transaction.update(eventRef, {seatingChart: newSeatingChart});
    });

    return {status: "success", bookingId: bookingRef.id};

  } catch (error: any) {
    console.error("Cash booking creation failed:", error);
    // Use the error code and message from the transaction if available
    if (error instanceof https.HttpsError) {
        throw error;
    }
    throw new https.HttpsError("internal", "Could not create cash booking.");
  }
});

/**
 * Confirms a cash booking (Admin action).
 */
export const confirmCashBooking = https.onCall(async (data, context) => {
  // Add admin auth check here in a real app
  const {bookingId} = data;
  if (!bookingId) {
    throw new https.HttpsError("invalid-argument", "Missing booking ID.");
  }

  const bookingRef = db.collection("bookings").doc(bookingId);

  try {
    await db.runTransaction(async (transaction) => {
      const bookingDoc = await transaction.get(bookingRef);
      if (!bookingDoc.exists) {
        throw new https.HttpsError("not-found", "Booking not found.");
      }
      const bookingData = bookingDoc.data() as any;

      if (bookingData.status !== "pending_cash") {
        throw new https.HttpsError("failed-precondition", "Booking is not pending cash payment.");
      }

      const eventRef = db.collection("events").doc(bookingData.eventId);
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new https.HttpsError("not-found", "Associated event not found.");
      }
      const eventData = eventDoc.data() as any;
      const newSeatingChart = {...eventData.seatingChart};

      // Change seat status from 'reserved' to 'booked'
      bookingData.seats.forEach((seatId: string) => {
        for (const row of newSeatingChart.rows) {
          const seat = row.seats.find((s: any) => s.id === seatId);
          if (seat && seat.status === "reserved") {
            seat.status = "booked";
          }
        }
      });

      const newSeatsAvailable = eventData.seatsAvailable - bookingData.seats.length;

      transaction.update(eventRef, {
        seatingChart: newSeatingChart,
        seatsAvailable: newSeatsAvailable < 0 ? 0 : newSeatsAvailable,
      });
      transaction.update(bookingRef, {status: "confirmed"});
    });

    return {status: "success", message: "Booking confirmed."};

  } catch (error: any) {
    console.error("Cash booking confirmation failed:", error);
    if (error instanceof https.HttpsError) {
        throw error;
    }
    throw new https.HttpsError("internal", "Failed to confirm booking.");
  }
});

/**
 * Scheduled function to clean up expired cash bookings.
 * Runs every hour.
 */
export const cleanupExpiredBookings = pubsub.schedule("every 60 minutes").onRun(async (context) => {
  console.log("Running cleanup for expired cash bookings...");
  const now = admin.firestore.Timestamp.now();
  const cutoff = new admin.firestore.Timestamp(now.seconds - (48 * 60 * 60), now.nanoseconds);

  const query = db.collection("bookings")
    .where("status", "==", "pending_cash")
    .where("createdAt", "<=", cutoff);

  const expiredBookings = await query.get();

  if (expiredBookings.empty) {
    console.log("No expired bookings to clean up.");
    return null;
  }

  const batch = db.batch();

  for (const doc of expiredBookings.docs) {
    const booking = doc.data();
    const eventRef = db.collection("events").doc(booking.eventId);
    
    // We must run this part in a transaction to safely update the event
    try {
      await db.runTransaction(async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists) return; // Event was deleted, nothing to do

        const eventData = eventDoc.data() as any;
        const newSeatingChart = {...eventData.seatingChart};

        booking.seats.forEach((seatId: string) => {
          for (const row of newSeatingChart.rows) {
            const seat = row.seats.find((s: any) => s.id === seatId);
            // Only release the seat if it was still reserved for this booking
            if (seat && seat.status === "reserved") {
              seat.status = "available";
            }
          }
        });

        transaction.update(eventRef, {seatingChart: newSeatingChart});
      });

      // After the transaction, update the booking status in the batch
      batch.update(doc.ref, {status: "cancelled"});
      console.log(`Cancelled expired booking ${doc.id}`);

    } catch (error) {
      console.error(`Failed to clean up booking ${doc.id}:`, error);
    }
  }

  await batch.commit();
  console.log(`Cleaned up ${expiredBookings.size} bookings.`);
  return null;
});


// --- EXISTING FUNCTIONS ---

/**
 * Creates a payment charge with Tap Payments and returns the payment URL.
 */
export const createOnlinePayment = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const {eventId, selectedSeats, totalAmount} = data;
  const userId = context.auth.uid;

  if (!eventId || !selectedSeats || !totalAmount) {
    throw new https.HttpsError("invalid-argument", "Missing required data.");
  }

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      throw new https.HttpsError("not-found", "Event not found.");
    }
    const eventData = eventDoc.data() as any;
    const pricePerSeat = eventData.price || 0;
    const serverCalculatedAmount = selectedSeats.length * pricePerSeat;

    if (totalAmount !== serverCalculatedAmount) {
      throw new https.HttpsError("invalid-argument", "Price mismatch.");
    }

    const bookingRef = db.collection("bookings").doc();
    await bookingRef.set({
      bookingId: bookingRef.id,
      userId: userId,
      eventId: eventId,
      seats: selectedSeats,
      amount: serverCalculatedAmount,
      status: "pending_payment",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentGateway: "tap",
    });

    const chargePayload = {
      amount: serverCalculatedAmount,
      currency: "SAR",
      customer: {
        first_name: context.auth.token.name || "Guest",
        email: context.auth.token.email,
      },
      source: {id: "src_all"},
      metadata: {bookingId: bookingRef.id},
      redirect: {url: `http://localhost:3000/booking/callback?booking_id=${bookingRef.id}`},
    };

    const tapResponse = await axios.post(`${TAP_API_BASE_URL}/charges`, chargePayload, {
      headers: {Authorization: `Bearer ${TAP_API_SECRET_KEY}`},
    });

    await bookingRef.update({gatewayChargeId: tapResponse.data.id});

    return {paymentUrl: tapResponse.data.transaction.url};

  } catch (error: any) {
    console.error("Payment creation failed:", error);
    throw new https.HttpsError("internal", "Payment creation failed.");
  }
});

/**
 * Verifies a payment with Tap and updates the booking and event data.
 */
export const verifyPayment = https.onCall(async (data, context) => {
  const {chargeId, bookingId} = data;
  if (!chargeId || !bookingId) {
    throw new https.HttpsError("invalid-argument", "Missing charge ID or booking ID.");
  }

  try {
    const tapResponse = await axios.get(`${TAP_API_BASE_URL}/charges/${chargeId}`, {
      headers: {Authorization: `Bearer ${TAP_API_SECRET_KEY}`},
    });

    const charge = tapResponse.data;
    const isSuccess = charge.status === "CAPTURED";

    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();
    if (!bookingDoc.exists) {
      throw new https.HttpsError("not-found", "Booking not found.");
    }
    const bookingData = bookingDoc.data() as any;

    if (isSuccess) {
        const eventRef = db.collection("events").doc(bookingData.eventId);
        
        await db.runTransaction(async (transaction) => {
            const eventDoc = await transaction.get(eventRef);
            if (!eventDoc.exists) {
                throw new https.HttpsError("not-found", "Event not found.");
            }
            const eventData = eventDoc.data() as any;
            const newSeatingChart = {...eventData.seatingChart};

            bookingData.seats.forEach((seatId: string) => {
                for (const row of newSeatingChart.rows) {
                    const seat = row.seats.find((s: any) => s.id === seatId);
                    if (seat && seat.status !== 'booked') {
                        seat.status = 'booked';
                    }
                }
            });
            
            transaction.update(eventRef, {seatingChart: newSeatingChart});
            transaction.update(bookingRef, {status: "confirmed", gatewayCharge: charge});
        });

        return {status: "success", message: "Payment verified and booking confirmed."};

    } else {
      await bookingRef.update({status: "failed", gatewayCharge: charge});
      return {status: "failed", message: "Payment was not successful."};
    }

  } catch (error: any) {
    console.error("Payment verification failed:", error);
    throw new https.HttpsError("internal", "Payment verification failed.");
  }
});
