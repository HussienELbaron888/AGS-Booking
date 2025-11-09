'use client';
import { EventList } from '@/components/events/event-list';
import { useEffect, useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { HeroSlider } from '@/components/events/hero-slider';

export default function Home() {
  const [lang, setLang] = useState('en');
  const { events, loading } = useEvents();

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


  const upcomingEvents = events.slice(0, 3); 

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <HeroSlider events={events} loading={loading} />
      
      <section id="events" className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold py-1 px-4 rounded-full mb-4">
            <Sparkles className="h-5 w-5" />
            <span>{lang === 'en' ? 'Upcoming Events' : 'الفعاليات القادمة'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-foreground mb-2">
            {lang === 'en' ? 'Don\'t Miss Out' : 'لا تفوت الفرصة'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'en' ? 'Here are some of our featured events. Book your spot today!' : 'إليك بعض فعالياتنا المميزة. احجز مكانك اليوم!'}
          </p>
        </div>
        <EventList events={upcomingEvents} loading={loading} />
        {events.length > 3 && (
            <div className="text-center mt-12">
                <Button variant="secondary" asChild>
                    <Link href="/calendar">
                        {lang === 'en' ? 'View All Events' : 'عرض جميع الفعاليات'}
                    </Link>
                </Button>
            </div>
        )}
      </section>
    </div>
  );
}
