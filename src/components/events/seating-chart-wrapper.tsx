'use client';

import { useState, useTransition, useEffect } from 'react';
import type { Event, Seat } from '@/lib/types';
import { SeatingChart } from './seating-chart';
import { Button } from '@/components/ui/button';
import { Ticket, X, CheckCircle, Loader2, CreditCard, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { doc, runTransaction } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useRouter } from 'next/navigation';

// Lazy load the cloud functions
const createOnlinePayment = httpsCallable(functions, 'createOnlinePayment');
const createCashBooking = httpsCallable(functions, 'createCashBooking');

interface SeatingChartWrapperProps {
  event: Event;
}

export function SeatingChartWrapper({ event: initialEvent }: SeatingChartWrapperProps) {
  const [event, setEvent] = useState(initialEvent);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booked' | 'error' | 'pending_payment'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [lang, setLang] = useState('en');
  const router = useRouter();

  const seatPrice = event.price || 50;
  const totalAmount = selectedSeats.length * seatPrice;

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  useEffect(() => {
    setLang(document.documentElement.lang || 'en');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          setLang(document.documentElement.lang || 'en');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return;
    if (bookingStatus !== 'idle') return;

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleCashBooking = async () => {
    if (selectedSeats.length === 0) return;
    setPaymentMethod('cash');
    startTransition(async () => {
      try {
        const bookingData = {
          eventId: event.id,
          selectedSeats: selectedSeats.map(s => s.id),
          totalAmount: totalAmount,
        };

        console.log("Calling createCashBooking with:", bookingData);
        
        const result: any = await createCashBooking(bookingData);

        if (result.data.status === 'success') {
          // Redirect to a confirmation page
          router.push(`/booking/cash-confirmation?bookingId=${result.data.bookingId}`);
        } else {
          throw new Error(result.data.message || (lang === 'ar' ? 'فشل إنشاء الحجز النقدي.' : 'Failed to create cash booking.'));
        }
      } catch (error: any) {
        console.error("Cash booking failed: ", error);
        setBookingStatus('error');
        setErrorMessage(error.message || (lang === 'ar' ? 'حدث خطأ غير متوقع أثناء الحجز.' : "An unexpected error occurred during booking."));
      }
    });
  };
  
  const handleOnlinePayment = () => {
      // This function is now disabled
      return;
  }

  const handleReset = () => {
    setSelectedSeats([]);
    setBookingStatus('idle');
    setPaymentMethod(null);
    setErrorMessage('');
  }

  // This success view is no longer directly reachable from this component
  // It will be handled by the cash-confirmation page
  if (bookingStatus === 'booked') {
    return (
       <div className="bg-card p-6 rounded-lg shadow-lg text-center data-[state=open]:animate-in data-[state=open]:fade-in" data-state="open">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">{lang === 'en' ? 'Booking Confirmed!' : 'تم تأكيد الحجز!'}</h2>
          <p className="font-semibold text-lg mb-2">{lang === 'en' ? 'Your Seats:' : 'مقاعدك:'}</p>
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {selectedSeats.map(seat => (
              <span key={seat.id} className="bg-accent/20 text-accent-foreground font-bold py-1 px-3 rounded-full">{seat.id}</span>
            ))}
          </div>
          <Button onClick={handleReset}>{lang === 'en' ? 'Make a New Booking' : 'القيام بحجز جديد'}</Button>
      </div>
    )
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold font-headline text-primary mb-4 text-center">{lang === 'en' ? 'Select Your Seats' : 'اختر مقاعدك'}</h2>
      <SeatingChart
        seatingChart={event.seatingChart}
        selectedSeats={selectedSeats}
        onSeatClick={handleSeatClick}
        isBookingFinalized={bookingStatus !== 'idle'}
      />
      
      {bookingStatus === 'error' && (
        <Alert variant="destructive" className="mt-4">
            <AlertTitle>{lang === 'ar' ? 'فشل الحجز' : 'Booking Failed'}</AlertTitle>
            <AlertDescription>
                {errorMessage}
                <Button onClick={handleReset} variant="link" className="p-0 h-auto mt-2">{lang === 'ar' ? 'حاول مرة أخرى' : 'Try again'}</Button>
            </AlertDescription>
        </Alert>
      )}

      {selectedSeats.length > 0 && bookingStatus === 'idle' && (
          <div className="mt-6 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-5" data-state="open">
            <Alert dir={lang === 'ar' ? 'rtl' : 'ltr'}>\n              <Ticket className="h-4 w-4" />
              <AlertTitle className="font-bold">{lang === 'en' ? 'Your Selection' : 'اختيارك'}</AlertTitle>
              <AlertDescription>
                <div className="flex flex-wrap gap-2 my-2">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex items-center bg-secondary py-1 px-3 rounded-full text-secondary-foreground font-medium text-sm">
                      {seat.id}
                      <button onClick={() => handleSeatClick(seat)} className="ml-2 rtl:mr-2 rtl:ml-0 text-muted-foreground hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className='my-4'>
                    <p className='font-bold text-lg'>{lang === 'ar' ? 'الإجمالي:' : 'Total:'} {totalAmount} {lang === 'ar' ? 'ريال' : 'SAR'}</p>
                </div>
                 <div className="flex flex-col gap-3 mt-4">
                    <Button onClick={handleCashBooking} className="w-full" disabled={isPending}>
                        {isPending && paymentMethod === 'cash' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4"/>}
                        {lang === 'en' ? 'Reserve for Cash Payment' : 'حجز للدفع النقدي'}
                    </Button>
                    <Button className="w-full" disabled={true}>
                        <CreditCard className="mr-2 h-4 w-4"/>
                        {lang === 'en' ? 'Pay Online (Coming Soon)' : 'الدفع الإلكتروني (قريباً)'}
                    </Button>
                 </div>
              </AlertDescription>
            </Alert>
          </div>
      )}
    </div>
  );
}
