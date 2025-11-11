'use client';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Calendar, Clock, Info, Users, Ticket } from 'lucide-react';
import { SeatingChartWrapper } from '@/components/events/seating-chart-wrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import React, { useEffect, useState } from 'react';
import type { Event } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useLanguage } from "@/context/language-context"; // 1. Import the hook

interface EventPageProps {
  // params are no longer passed as a prop, but obtained via useParams hook
}

export default function EventPage({}: EventPageProps) {
  const { lang } = useLanguage(); // 2. Use the hook to get the current language
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  // The old useState and useEffect for language have been removed.

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const docRef = doc(db, 'events', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any; // Use any to handle old data structure
        // This ensures backward compatibility with events that don't have the new fields
        const fullEvent: Event = {
          id: docSnap.id,
          ...data,
          name_en: data.name_en || data.name,
          name_ar: data.name_ar || data.name,
          description_en: data.description_en || data.description,
          description_ar: data.description_ar || data.description,
        };
        setEvent(fullEvent);
      } else {
        setEvent(null);
        notFound();
      }
      setLoading(false);
    }, (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
      setLoading(false);
      setEvent(null); 
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found or access denied.</div>;
  }

  const imagePlaceholder = PlaceHolderImages.find(p => p.imageUrl === event.image);

  const eventName = lang === 'ar' ? event.name_ar : event.name_en;
  const description = lang === 'ar' ? event.description_ar : event.description_en;
  const keyHighlights = event.keyHighlights;

  return (
    // 3. Adjust the top padding to push content below the header
    <div className="container mx-auto pt-28 pb-10 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-lg mb-6">
            <Image
              src={event.image}
              alt={eventName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={imagePlaceholder?.imageHint}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">{eventName}</h1>
          
          <div className="space-y-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-medium">{new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-accent" />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
                <Ticket className="h-5 w-5 text-accent" />
                <span className="font-medium">
                  {lang === 'ar' 
                    ? `${event.seatsAvailable} مقعد متاح من أصل ${event.totalSeats}`
                    : `${event.seatsAvailable} / ${event.totalSeats} seats available`
                  }
                </span>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-1 shrink-0" />
              <p>{description}</p>
            </div>
             <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-accent mt-1 shrink-0" />
              <p><span className="font-semibold text-foreground/80">{lang === 'en' ? 'Highlights:' : 'أهم النقاط:'}</span> {keyHighlights}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <SeatingChartWrapper event={event} />
        </div>
      </div>
    </div>
  );
}
