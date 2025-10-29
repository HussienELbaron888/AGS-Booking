'use client';
import { EventList } from '@/components/events/event-list';
import { events } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function Home() {
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">
        {lang === 'en' ? 'Upcoming Events' : 'الأحداث القادمة'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {lang === 'en' ? 'Book your seats for our exciting school events.' : 'احجز مقعدك لأحداثنا المدرسية المثيرة.'}
      </p>
      <EventList events={events} />
    </div>
  );
}
