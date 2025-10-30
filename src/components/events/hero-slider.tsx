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
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';

export function HeroSlider({ events }: { events: Event[] }) {
  const latestEvents = useMemo(() => events.slice(0, 4), [events]);
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {latestEvents.map((event, index) => (
            <CarouselItem key={event.id}>
              <div className="p-1">
                <Card>
                  <CardContent className="relative flex aspect-video items-center justify-center p-6">
                    <Image
                      fill
                      src={event.image}
                      alt={event.name}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 text-center text-white flex flex-col items-center">
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        جدید
                      </Badge>
                      <h2 className="text-4xl md:text-6xl font-bold font-headline">
                        {event.name}
                      </h2>
                      <p className="mt-2 text-lg md:text-xl font-light">
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-4 text-sm">
                        <span>AGS Boys Auditorium</span>
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-6">
                        <Button variant="outline" className="text-white">
                          عن الفعالية
                        </Button>
                        <Link href={`/events/${event.id}`}>
                          <Button className="bg-primary hover:bg-primary/90">
                            احجز الآن ←
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 border-none text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 border-none text-white" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {latestEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 rounded-full ${current === index ? 'bg-primary' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
