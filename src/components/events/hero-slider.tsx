'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Event } from '@/lib/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HeroSlider({ events }: { events: Event[] }) {
  const latestEvents = events.slice(0, 5);
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState('en');

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
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect(); // Set initial value

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="relative w-full bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Carousel setApi={setApi} className="w-full group" opts={{ loop: true }}>
        <CarouselContent>
          {latestEvents.map((event) => (
            <CarouselItem key={event.id}>
              <div className="relative w-full h-[70vh] md:h-[80vh]">
                <Image
                  fill
                  src={event.image}
                  alt={event.name}
                  className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                <div className="absolute inset-0 flex items-center justify-start text-white">
                  <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="max-w-xl text-start">
                      <h2 className="text-4xl md:text-6xl font-bold font-headline mb-4">
                        {event.name}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-200 line-clamp-3 mb-6">
                        {event.description}
                      </p>
                      <p className="text-gray-300 mb-8">{`${event.time}, ${new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                         <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                           <Link href={`/events/${event.id}`}>
                              {lang === 'en' ? 'BOOK NOW' : 'احجز الآن'}
                           </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10 p-4">
        <div className="container mx-auto h-full flex items-end">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {latestEvents.slice(0, 4).map((event, index) => (
              <button 
                key={event.id}
                onClick={() => scrollTo(index)}
                className={cn(
                  "group relative w-full h-24 rounded-md overflow-hidden text-white text-start p-2 transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500",
                  index === current ? "border-2 border-accent" : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent/80">
                    {lang === 'en' ? 'Upcoming Event' : 'فعالية قادمة'}
                  </p>
                  <p className="font-semibold text-sm line-clamp-2">{event.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
