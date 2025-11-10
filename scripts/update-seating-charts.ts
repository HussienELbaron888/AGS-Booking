import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../src/lib/firebase'; // Adjust this path if needed
import { generateSeats } from '../src/lib/seats'; // Adjust this path if needed

const updateSeatingCharts = async () => {
  console.log('Starting to update seating charts for all events with the final layout...');

  try {
    const eventsCollectionRef = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollectionRef);

    if (querySnapshot.empty) {
      console.log('No events found.');
      return;
    }

    const batch = writeBatch(db);
    const newSeatingChart = generateSeats();

    for (const docSnapshot of querySnapshot.docs) {
      const eventDocRef = doc(db, 'events', docSnapshot.id);
      // Using a deep copy to prevent object mutation issues across updates
      batch.update(eventDocRef, {
        seatingChart: JSON.parse(JSON.stringify(newSeatingChart))
      });
      console.log(`Queued update for event: ${docSnapshot.id}`);
    }
    
    await batch.commit();
    console.log(`Successfully updated seating charts for ${querySnapshot.size} events.`);

  } catch (error) {
    console.error('Error updating seating charts:', error);
  }
};

updateSeatingCharts();
