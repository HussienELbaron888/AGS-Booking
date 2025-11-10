'use client';
import { EventList } from '@/components/events/event-list';
import { useEffect, useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Sparkles, Drama, School } from 'lucide-react';
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

  const { boysEvents, girlsEvents } = useMemo(() => {
    const boysEvents = events.filter(event => event.venue === 'boys-theater');
    const girlsEvents = events.filter(event => event.venue === 'girls-theater');
    return { boysEvents, girlsEvents };
  }, [events]);


  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <HeroSlider events={events} loading={loading} />
      
      <section id="events" className="container mx-auto py-16 px-4 space-y-16">
        
        {/* Boys' Theater Events */}
        {loading ? (
          <div>
            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold py-1 px-4 rounded-full mb-4">
                <Drama className="h-5 w-5" />
                <span>{lang === 'en' ? "Boys' Theater Events" : 'فعاليات مسرح البنين'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-foreground mb-2">
                {lang === 'en' ? 'Stage is Set' : 'العروض القادمة'}
              </h2>
            </div>
            <EventList events={[]} loading={true} />
          </div>
        ) : boysEvents.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold py-1 px-4 rounded-full mb-4">
                <Drama className="h-5 w-5" />
                <span>{lang === 'en' ? "Boys' Theater Events" : 'فعاليات مسرح البنين'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-foreground mb-2">
                {lang === 'en' ? 'Stage is Set' : 'العروض القادمة'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {lang === 'en' ? 'Check out the upcoming events at the boys\' theater.' : 'اكتشف الفعاليات القادمة في مسرح البنين.'}
              </p>
            </div>
            <EventList events={boysEvents} loading={loading} />
          </div>
        )}

        {/* Girls' Theater Events */}
        {loading ? (
           <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold py-1 px-4 rounded-full mb-4">
                <School className="h-5 w-5" />
                <span>{lang === 'en' ? "Girls' Theater Events" : 'فعاليات مسرح البنات'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-foreground mb-2">
                {lang === 'en' ? 'Spotlight On' : 'تحت الأضواء'}
              </h2>
            </div>
            <EventList events={[]} loading={true} />
          </div>
        ) : girlsEvents.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold py-1 px-4 rounded-full mb-4">
                <School className="h-5 w-5" />
                <span>{lang === 'en' ? "Girls' Theater Events" : 'فعاليات مسرح البنات'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-foreground mb-2">
                {lang === 'en' ? 'Spotlight On' : 'تحت الأضواء'}
              </h2>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {lang === 'en' ? 'Discover the amazing performances at the girls\' theater.' : 'اكتشفي العروض المذهلة في مسرح البنات.'}
              </p>
            </div>
            <EventList events={girlsEvents} loading={loading} />
          </div>
        )}


        {events.length > 0 && (
            <div className="text-center pt-8 border-t border-dashed">
                <p className="text-muted-foreground mb-4">{lang === 'en' ? 'Or view all events in one place.' : 'أو شاهد جميع الفعاليات في مكان واحد.'}</p>
                <Button variant="secondary" asChild>
                    <Link href="/calendar">
                        {lang === 'en' ? 'View Full Calendar' : 'عرض التقويم الكامل'}
                    </Link>
                </Button>
            </div>
        )}

        {!loading && events.length === 0 && (
             <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-muted-foreground">{lang === 'en' ? 'No events scheduled yet.' : 'لا توجد فعاليات مجدولة بعد.'}</h2>
                <p className="text-muted-foreground mt-2">{lang === 'en' ? 'Please check back later for updates.' : 'يرجى التحقق مرة أخرى لاحقًا للحصول على التحديثات.'}</p>
            </div>
        )}
      </section>
    </div>
  );
}
