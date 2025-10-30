'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Event } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HeroSlider({ events }: { events: Event[] }) {
  const latestEvents = useMemo(() => events.slice(0, 5), [events]);
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Carousel setApi={setApi} className="w-full group" opts={{ loop: true }}>
        <CarouselContent>
          {latestEvents.map((event) => (
            <CarouselItem key={event.id}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh] md:min-h-[60vh]">
                      <div className="flex flex-col justify-center p-8 lg:p-12 order-2 md:order-1">
                        <h2 className="text-3xl lg:text-5xl font-bold font-headline text-primary mb-4">
                          {event.name}
                        </h2>
                        <p className="text-muted-foreground text-base lg:text-lg line-clamp-3 mb-6">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground mb-8">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-accent" />
                            <span>
                               {new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-accent" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <div className="flex space-x-4 rtl:space-x-reverse mt-auto">
                          <Button asChild className="bg-primary hover:bg-primary/90">
                             <Link href={`/events/${event.id}`}>
                                {lang === 'en' ? 'Book Now' : 'احجز الآن'}
                               <ArrowRight className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                            </Link>
                          </Button>
                           <Button asChild variant="outline">
                             <Link href={`/events/${event.id}`}>
                                {lang === 'en' ? 'Learn More' : 'اعرف المزيد'}
                             </Link>
                          </Button>
                        </div>
                      </div>
                       <div className="relative order-1 md:order-2 min-h-[250px] md:min-h-full">
                        <Image
                          fill
                          src={event.image}
                          alt={event.name}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r md:from-black/10 md:to-transparent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 border-none text-foreground transition-opacity opacity-0 group-hover:opacity-100" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 border-none text-foreground transition-opacity opacity-0 group-hover:opacity-100" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="text-foreground font-bold">{String(current).padStart(2, '0')}</span>
        <div className="w-12 h-0.5 bg-muted-foreground/30 rounded-full">
           <div 
              className="h-full bg-foreground transition-all duration-300" 
              style={{ width: `${(current / latestEvents.length) * 100}%`}}
            />
        </div>
        <span>{String(latestEvents.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
