'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import { useEffect, useState } from 'react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
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

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            data-ai-hint="theater stage"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl mb-2 text-primary">{event.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 mb-4">{event.description}</CardDescription>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <span>{event.time}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/events/${event.id}`}>
            {lang === 'en' ? 'View Details & Book' : 'عرض التفاصيل والحجز'}
            <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
