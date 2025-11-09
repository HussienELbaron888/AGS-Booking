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

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-2 border-secondary" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            data-ai-hint="theater stage"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-xl mb-2 text-foreground">{event.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2 mb-4">{event.description}</CardDescription>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span>{new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <span>{event.time}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>
            {lang === 'en' ? 'View Details & Book' : 'عرض التفاصيل والحجز'}
            <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
