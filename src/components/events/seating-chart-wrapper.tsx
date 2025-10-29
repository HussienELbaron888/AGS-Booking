'use client';

import { useState, useTransition } from 'react';
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
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-4">You have successfully reserved your seat(s). A confirmation with a QR code has been sent to your email.</p>
          <p className="font-semibold text-lg mb-2">Your Seats:</p>
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {selectedSeats.map(seat => (
              <span key={seat.id} className="bg-accent/20 text-accent-foreground font-bold py-1 px-3 rounded-full">{seat.id}</span>
            ))}
          </div>
          <Button onClick={handleReset}>Book More Seats</Button>
      </div>
    )
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold font-headline text-primary mb-4 text-center">Select Your Seats</h2>
      <SeatingChart
        seatingChart={event.seatingChart}
        selectedSeats={selectedSeats}
        onSeatClick={handleSeatClick}
      />
      
      {selectedSeats.length > 0 && (
          <div className="mt-6 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-5" data-state="open">
            <Alert>
              <Ticket className="h-4 w-4" />
              <AlertTitle className="font-bold">Your Selection</AlertTitle>
              <AlertDescription>
                <div className="flex flex-wrap gap-2 my-2">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex items-center bg-secondary py-1 px-3 rounded-full text-secondary-foreground font-medium text-sm">
                      {seat.id}
                      <button onClick={() => handleSeatClick(seat)} className="ml-2 text-muted-foreground hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                 <Button onClick={handleBooking} className="w-full mt-4" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reserve {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
      )}
    </div>
  );
}
