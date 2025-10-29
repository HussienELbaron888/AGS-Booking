'use client';

import { useState } from 'react';
import type { SeatingChart as SeatingChartType, Seat as SeatType } from '@/lib/types';
import { Seat } from './seat';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface SeatingChartProps {
  seatingChart: SeatingChartType;
  selectedSeats: SeatType[];
  onSeatClick: (seat: SeatType) => void;
}

export function SeatingChart({ seatingChart, selectedSeats, onSeatClick }: SeatingChartProps) {
  const [scale, setScale] = useState(1);
  const seatSize = 40; // in pixels

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 2));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

  return (
    <div className="w-full">
      <div className="bg-muted/50 p-2 rounded-md mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs items-center">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md border bg-card"></div>Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-accent"></div>Selected</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-muted-foreground/50 opacity-50"></div>Unavailable</div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleResetZoom} className="h-8 w-8"><RotateCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <ScrollArea className="w-full h-[500px] border rounded-lg bg-background">
        <div className="relative p-8 flex justify-center items-center" style={{ minWidth: `${seatingChart.rows[0].seats.length * seatSize * scale + 64}px`}}>
          <div
            className="transition-transform duration-300 origin-center"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="bg-muted p-2 rounded-t-lg text-center font-semibold text-muted-foreground mb-8 text-sm" style={{ width: `${seatingChart.rows[0].seats.length * (seatSize + 8)}px` }}>STAGE</div>

            <div className="flex flex-col gap-2">
              {seatingChart.rows.map(row => (
                <div key={row.id} className="flex items-center justify-center gap-2">
                  <div className="w-8 text-center font-bold text-muted-foreground">{row.id}</div>
                  {row.seats.map(seat => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeats.some(s => s.id === seat.id)}
                      onClick={onSeatClick}
                      size={seatSize}
                    />
                  ))}
                   <div className="w-8 text-center font-bold text-muted-foreground">{row.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
