'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface NewHeroSliderProps {
  events: Event[];
  loading: boolean;
}

export function NewHeroSlider({ events, loading }: NewHeroSliderProps) {
  const [lang, setLang] = useState('en');
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  }, [events.length]);

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

    if (events.length > 1) {
      const slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
      return () => {
        clearInterval(slideInterval);
        observer.disconnect();
      };
    }
    return () => observer.disconnect();

  }, [lang, events.length, nextSlide]);

  if (loading || events.length === 0) {
    return (
      <div className="relative h-screen w-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute h-full w-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5 }}
        >
          <Image
            src={currentEvent.image}
            alt={lang === 'en' ? currentEvent.name : currentEvent.name_ar}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 flex items-center justify-start text-white z-10">
        <div className="container mx-auto px-4 md:px-8">
            <motion.div 
              key={currentIndex} // Re-trigger animation on slide change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl text-left rtl:text-right"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold font-headline uppercase tracking-tighter mb-4 drop-shadow-lg">
                    {lang === 'en' ? currentEvent.name : currentEvent.name_ar}
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl text-white/90 mb-8 drop-shadow-md line-clamp-3">
                    {lang === 'en' ? currentEvent.description : currentEvent.description_ar}
                </p>
                <Button size="lg" asChild className="border-2 border-white bg-transparent hover:bg-white hover:text-black font-bold py-3 px-6 rounded-none">
                    <Link href={`/events/${currentEvent.id}`}>
                        {lang === 'en' ? 'Event Details' : 'تفاصيل الحدث'}
                    </Link>
                </Button>
            </motion.div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${currentIndex === index ? 'bg-white w-6' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
