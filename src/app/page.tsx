'use client';
import { EventList } from '@/components/events/event-list';
import { useEffect, useState } from 'react';
import { HeroSlider } from '@/components/events/hero-slider';
import { useEvents } from '@/hooks/useEvents';

export default function Home() {
  const [lang, setLang] = useState('en');
  const { events, loading } = useEvents();

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
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>{lang === 'en' ? 'Loading events...' : 'جاري تحميل الأحداث ...'}</p>
        </div>
      ) : (
        <>
          <HeroSlider events={events} />
          <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2 mt-8">
              {lang === 'en' ? 'Upcoming Events' : 'الأحداث القادمة'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {lang === 'en' ? 'Book your seats for our exciting school events.' : 'احجز مقعدك لأحداثنا المدرسية المثيرة.'}
            </p>
            <EventList events={events} />
          </div>
        </>
      )}
    </div>
  );
}
