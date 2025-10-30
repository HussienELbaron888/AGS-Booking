'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useEvents } from '@/hooks/useEvents';
import type { Event } from '@/lib/types';
import { EventCard } from '@/components/events/event-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPage() {
  const { events, loading } = useEvents();
  const [date, setDate] = useState<Date | undefined>(new Date());
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


  const eventDates = useMemo(() => {
    return events.map(event => new Date(event.date));
  }, [events]);

  const selectedEvents = useMemo(() => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }, [date, events]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-65px)]">
          <p>{lang === 'en' ? 'Loading events...' : 'جاري تحميل الأحداث ...'}</p>
        </div>
      )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-8 text-center">
        {lang === 'en' ? 'Events Calendar' : 'تقويم الفعاليات'}
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              event: eventDates,
            }}
            modifiersStyles={{
              event: {
                fontWeight: 'bold',
                color: 'hsl(var(--accent))',
                textDecoration: 'underline',
              },
            }}
          />
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">
                        {lang === 'en' ? 'Events on' : 'الفعاليات في يوم'}{' '}
                        {date ? date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '...'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">{lang === 'en' ? 'No events scheduled for this day.' : 'لا توجد فعاليات مجدولة في هذا اليوم.'}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
