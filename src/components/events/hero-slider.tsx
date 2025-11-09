'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from '../ui/skeleton';

interface HeroSliderProps {
  events: Event[];
  loading: boolean;
}

export function HeroSlider({ events, loading }: HeroSliderProps) {
  const [lang, setLang] = useState('en');

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

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-10">
            <Skeleton className="w-full h-[50vh] rounded-2xl" />
        </div>
    )
  }

  return (
    <div className="w-full" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Carousel
        opts={{
            align: "start",
            loop: true,
        }}
        plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
        ]}
        className="w-full"
        >
        <CarouselContent>
            {events.map((event) => (
            <CarouselItem key={event.id}>
                <div className="relative h-[60vh] md:h-[70vh] w-full">
                    <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                        <div className="container mx-auto">
                            <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-3 drop-shadow-lg">
                                {event.name}
                            </h2>
                            <p className="text-lg md:text-xl max-w-3xl text-white/90 line-clamp-2 mb-6 drop-shadow-md">
                                {event.description}
                            </p>
                            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link href={`/events/${event.id}`}>
                                    {lang === 'en' ? 'Book Your Seat' : 'احجز مقعدك'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CarouselItem>
            ))}
        </CarouselContent>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <CarouselPrevious className="static translate-y-0 text-white bg-white/20 hover:bg-white/30 border-white/30" />
            <CarouselNext className="static translate-y-0 text-white bg-white/20 hover:bg-white/30 border-white/30" />
        </div>
        </Carousel>
    </div>
  );
}
