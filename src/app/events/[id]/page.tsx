'use client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Info, Users } from 'lucide-react';
import { SeatingChartWrapper } from '@/components/events/seating-chart-wrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import type { Event } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import React from 'react';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const [lang, setLang] = useState('en');
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const id = React.use(Promise.resolve(params.id));

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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const docRef = doc(db, 'events', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
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
      // We can show a generic error to the user, the detailed one is in the console
      // for development. Or we could choose to show notFound().
      // For now, let's just indicate an error state.
      setEvent(null); 
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    // This can happen if the event is not found or if there's a permission error.
    // The console will have the detailed error for developers.
    return <div>Event not found or access denied.</div>;
  }

  const imagePlaceholder = PlaceHolderImages.find(p => p.imageUrl === event.image);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-lg mb-6">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={imagePlaceholder?.imageHint}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">{lang === 'ar' ? event.name : event.name}</h1>
          
          <div className="space-y-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-medium">{new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-accent" />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent mt-1 shrink-0" />
              <p>{lang === 'ar' ? event.longDescription : event.longDescription}</p>
            </div>
             <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-accent mt-1 shrink-0" />
              <p><span className="font-semibold text-foreground/80">{lang === 'en' ? 'Highlights:' : 'أهم النقاط:'}</span> {lang === 'ar' ? event.keyHighlights : event.keyHighlights}</p>
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
