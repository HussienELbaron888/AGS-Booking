'use client';

import { cn } from '@/lib/utils';
import type { Seat as SeatType } from '@/lib/types';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: (seat: SeatType) => void;
  isClickable: boolean;
  size: number;
}

const seatIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M4 18.5v-3.5c0-1.103.897-2 2-2h12c1.103 0 2 .897 2 2v3.5c0 .668-.383 1.253-.968 1.574l-1.688.913A3.001 3.001 0 0 1 15 24H9a3.001 3.001 0 0 1-2.344-2.993l-1.688-.913C4.383 19.753 4 19.168 4 18.5zM6 4h12c1.103 0 2 .897 2 2v6H4V6c0-1.103.897-2 2-2z"></path>
  </svg>
);

export function Seat({ seat, isSelected, onClick, isClickable, size }: SeatProps) {
  if (seat.type === 'aisle' || seat.type === 'empty') {
    return <div style={{ width: `${size}px`, height: `${size}px` }} />;
  }

  const canBeClicked = isClickable && seat.status === 'available';
  const currentStatus = isSelected ? 'selected' : seat.status;

  return (
    <button
      aria-label={`Seat ${seat.id}, Status: ${currentStatus}`}
      onClick={() => canBeClicked && onClick(seat)}
      disabled={!canBeClicked && !isSelected}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        'flex items-center justify-center rounded-t-md transition-all duration-200 relative',
        {
          'cursor-pointer': canBeClicked || isSelected,
          'cursor-not-allowed': !canBeClicked && !isSelected,
          // Base styles for an available seat
          'text-card-foreground/50 hover:text-primary hover:scale-110': seat.status === 'available',
          // When a seat is selected by the user
          'text-primary scale-110 shadow-lg': isSelected,
          // When a seat is temporarily reserved (cash booking)
          'text-yellow-500 opacity-80': seat.status === 'reserved',
          // When a seat is permanently booked (paid)
          'text-destructive/50': seat.status === 'booked',
           // Legacy statuses
          'text-destructive/50': seat.status === 'unavailable' || seat.status === 'blocked',
        }
      )}
    >
      {seatIcon}
       <span className={cn(
        "absolute text-background font-bold text-[8px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-2px]"
        )}>
        {seat.number}
      </span>
    </button>
  );
}
