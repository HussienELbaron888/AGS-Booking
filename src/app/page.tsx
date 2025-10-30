'use client';
import { EventList } from '@/components/events/event-list';
import { useEffect, useState } from 'react';
import { HeroSlider } from '@/components/events/hero-slider';
import { useEvents } from '@/hooks/useEvents';

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
  const upcomingEvents = events.slice(5);

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>{lang === 'en' ? 'Loading events...' : 'جاري تحميل الأحداث ...'}</p>
        </div>
      ) : (
        <>
          <HeroSlider events={sliderEvents} />
          <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2 mt-8">
              {lang === 'en' ? 'Current Events' : 'الفعاليات الحالية'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {lang === 'en' ? 'Book your seats for our exciting school events.' : 'احجز مقعدك لأحداثنا المدرسية المثيرة.'}
            </p>
            <EventList events={sliderEvents} />

            {upcomingEvents.length > 0 && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2 mt-16">
                  {lang === 'en' ? 'Upcoming Events' : 'الأحداث القادمة'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {lang === 'en' ? 'Stay tuned for more exciting events.' : 'ترقبوا المزيد من الفعاليات المثيرة.'}
                </p>
                <EventList events={upcomingEvents} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
