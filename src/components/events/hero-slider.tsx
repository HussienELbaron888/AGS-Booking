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
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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
    <div className="relative w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Carousel setApi={setApi} className="w-full group" opts={{ loop: true }}>
        <CarouselContent>
          {latestEvents.map((event) => (
            <CarouselItem key={event.id}>
              <div className="relative w-full h-[70vh] md:h-[85vh]">
                <Image
                  fill
                  src={event.image}
                  alt={event.name}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="max-w-3xl mx-auto">
                      <h2 className="text-4xl md:text-7xl font-extrabold font-headline mb-4 text-foreground">
                        {event.name}
                      </h2>
                      <p className="text-lg md:text-xl text-muted-foreground line-clamp-3 mb-6">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-center gap-6 text-muted-foreground mb-8">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-5 w-5 text-accent"/>
                           {new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                         <div className="flex items-center gap-2">
                           <Clock className="h-5 w-5 text-accent"/>
                           {event.time}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <Button asChild size="lg">
                           <Link href={`/events/${event.id}`}>
                              {lang === 'en' ? 'Book Your Seat' : 'احجز مقعدك'}
                              <ArrowRight className="ml-2 h-5 w-5" />
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 p-4">
        <div className="flex items-center justify-center gap-2">
            {latestEvents.map((_, index) => (
              <button 
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
