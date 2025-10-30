'use client';

import { useState, useTransition, useEffect } from 'react';
import type { Event, Seat } from '@/lib/types';
import { SeatingChart } from './seating-chart';
import { Button } from '@/components/ui/button';
import { Ticket, X, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SeatingChartWrapperProps {
  event: Event;
}

export function SeatingChartWrapper({ event }: SeatingChartWrapperProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booked'>('idle');
  const [isPending, startTransition] = useTransition();
  const [lang, setLang] = useState('en');

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
    if (seat.status === 'unavailable' || seat.status === 'reserved') return;

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleBooking = () => {
    startTransition(() => {
        // Simulate network latency
        setTimeout(() => {
            setBookingStatus('booked');
        }, 1000)
    });
  };
  
  const handleReset = () => {
    setSelectedSeats([]);
    setBookingStatus('idle');
  }

  if (bookingStatus === 'booked') {
    return (
       <div className="bg-card p-6 rounded-lg shadow-lg text-center data-[state=open]:animate-in data-[state=open]:fade-in" data-state="open">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">{lang === 'en' ? 'Booking Confirmed!' : 'تم تأكيد الحجز!'}</h2>
          <p className="text-muted-foreground mb-4">{lang === 'en' ? 'You have successfully reserved your seat(s). A confirmation with a QR code has been sent to your email.' : 'لقد حجزت مقعدك (مقاعدك) بنجاح. تم إرسال تأكيد مع رمز الاستجابة السريعة إلى بريدك الإلكتروني.'}</p>
          <p className="font-semibold text-lg mb-2">{lang === 'en' ? 'Your Seats:' : 'مقاعدك:'}</p>
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {selectedSeats.map(seat => (
              <span key={seat.id} className="bg-accent/20 text-accent-foreground font-bold py-1 px-3 rounded-full">{seat.id}</span>
            ))}
          </div>
          <Button onClick={handleReset}>{lang === 'en' ? 'Book More Seats' : 'حجز المزيد من المقاعد'}</Button>
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
      />
      
      {selectedSeats.length > 0 && (
          <div className="mt-6 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-5" data-state="open">
            <Alert dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <Ticket className="h-4 w-4" />
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
                 <Button onClick={handleBooking} className="w-full mt-4" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {lang === 'en' ? `Reserve ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}` : `حجز ${selectedSeats.length} مقعد${selectedSeats.length > 1 ? 'مقاعد' : ''}`}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
      )}
    </div>
  );
}
