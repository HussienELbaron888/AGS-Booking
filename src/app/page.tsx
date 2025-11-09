'use client';
import { EventList } from '@/components/events/event-list';
import { useEffect, useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline text-foreground mb-4">
              {lang === 'en' ? 'Experience Our School\'s Vibrant Events' : 'استكشف فعاليات مدرستنا المليئة بالحياة'}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {lang === 'en' ? 'From theater shows to science fairs, be a part of our community. Book your tickets and join the excitement.' : 'من العروض المسرحية إلى المعارض العلمية، كن جزءًا من مجتمعنا. احجز تذكرتك وانضم إلى الإثارة.'}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link href="#events">
                  {lang === 'en' ? 'Browse Events' : 'تصفح الفعاليات'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/calendar">
                  <Calendar className="mr-2 h-5 w-5" />
                  {lang === 'en' ? 'View Calendar' : 'عرض التقويم'}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://picsum.photos/seed/school-event/1200/800"
              alt="School Event"
              fill
              className="object-cover"
              data-ai-hint="school event community"
            />
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
          </div>
        </div>
      </section>
      
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
