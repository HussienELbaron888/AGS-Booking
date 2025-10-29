'use client';

import { useState, useEffect } from 'react';
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
  const seatSize = 28; 
  const gapSize = 6;
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setLang(html.lang || 'en');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
    setLang(html.lang || 'en'); // Initial set

    return () => observer.disconnect();
  }, []);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 1.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

  const numSeats = seatingChart.rows[0]?.seats.length || 0;
  const chartWidth = numSeats * (seatSize + gapSize);

  return (
    <div className="w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-muted/50 p-2 rounded-md mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs items-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border bg-card"></div>{lang === 'en' ? 'Available' : 'متاح'}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent"></div>{lang === 'en' ? 'Selected' : 'محدد'}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-muted-foreground/50 opacity-50"></div>{lang === 'en' ? 'Unavailable' : 'غير متاح'}</div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleResetZoom} className="h-8 w-8"><RotateCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <ScrollArea className="w-full h-[500px] border rounded-lg bg-background">
        <div className="relative p-4 sm:p-8 flex justify-center items-center" style={{ minWidth: `${chartWidth * scale + 64}px`}}>
          <div
            className="transition-transform duration-300 origin-center"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="bg-primary/80 mb-8 p-2 rounded-lg text-center font-semibold text-primary-foreground text-sm shadow-inner" style={{ width: `${chartWidth * 0.6}px`, marginLeft: 'auto', marginRight: 'auto' }}>
              S T A G E
            </div>
            <div className="flex flex-col gap-2">
              {seatingChart.rows.map(row => (
                <div key={row.id} className="flex items-center justify-center" style={{ gap: `${gapSize}px`}}>
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
