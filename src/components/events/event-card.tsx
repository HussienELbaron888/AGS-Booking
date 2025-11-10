'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Ticket } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const initialLang = document.documentElement.lang || 'en';
    setLang(initialLang);
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

  const eventName = lang === 'ar' ? event.name_ar : event.name_en;
  const eventDescription = lang === 'ar' ? event.description_ar : event.description_en;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={eventName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="theater stage"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 rtl:right-4 rtl:left-auto">
          <Badge variant="destructive" className="font-semibold flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5"/>
            <span>
              {lang === 'ar' ? `متبقي ${event.seatsAvailable}` : `${event.seatsAvailable} Left`}
            </span>
          </Badge>
        </div>
        <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto">
          <Badge variant="secondary" className="font-semibold">{new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}</Badge>
        </div>
      </div>
      <CardContent className="flex-grow p-5 flex flex-col">
        <h3 className="font-headline font-bold text-xl mb-2 text-foreground flex-grow">{eventName}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{eventDescription}</p>
        
        <div className="border-t border-border pt-4 mt-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                </div>
                 <Button asChild variant="ghost" size="sm" className="h-auto px-2 py-1">
                  <Link href={`/events/${event.id}`}>
                    {lang === 'en' ? 'Book Now' : 'احجز الآن'}
                    <ArrowRight className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0" />
                  </Link>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
