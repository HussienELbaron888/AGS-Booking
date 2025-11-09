'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function AppFooter() {
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

  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-16">
      <div className="container mx-auto flex flex-col justify-center items-center gap-4">
        <Image
          src="/white logo.png"
          alt="Advanced Generations International Schools Logo"
          width={150}
          height={60}
          className="object-contain"
        />
        <p className="text-sm text-center text-muted-foreground" suppressHydrationWarning>
          {lang === 'ar'
            ? 'جميع الحقوق محفوظة لـ AGS | 2025 - تصميم وتطوير بواسطة Pixelle®'
            : 'All Rights reserved to AGS | 2025 - Design & Developed by Pixelle®'}
        </p>
      </div>
    </footer>
  );
}
