'use client';
import { EventList } from '@/components/events/event-list';
import { useEffect, useState } from 'react';
import { HeroSlider } from '@/components/events/hero-slider';
import { useEvents } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [lang, setLang] = useState('en');
  const { events, loading } = useEvents();

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

  const sliderEvents = events.slice(0, 5);
  const otherEvents = events.slice(0); // Show all events in the list for now

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {loading ? (
        <>
          <Skeleton className="h-[85vh] w-full" />
          <div className="container mx-auto py-8 px-4">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </>
      ) : (
        <>
          <HeroSlider events={sliderEvents} />
          <div className="container mx-auto py-16 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-foreground mb-2">
                {lang === 'en' ? 'Our Events' : 'فعالياتنا'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {lang === 'en' ? 'Book your seats for our exciting school events. Discover what\'s happening next.' : 'احجز مقعدك لأحداثنا المدرسية المثيرة. اكتشف ماذا سيحدث بعد ذلك.'}
              </p>
            </div>
            <EventList events={otherEvents} />
          </div>
        </>
      )}
    </div>
  );
}
