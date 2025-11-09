'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function AppFooter() {
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

  return (
    <footer className="bg-background border-t mt-16">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                 <Image
                  src="/white logo.png"
                  alt="Advanced Generations International Schools Logo"
                  width={80}
                  height={40}
                  className="object-contain"
                />
            </div>
            <p className="text-sm text-center text-muted-foreground" suppressHydrationWarning>
              {lang === 'ar'
                ? '© 2025 مدارس الأجيال المتطورة. جميع الحقوق محفوظة.'
                : '© 2025 AGS. All Rights Reserved.'}
            </p>
            <div className="text-sm text-muted-foreground">
                 {lang === 'ar' ? 'تصميم وتطوير Pixelle®' : 'Designed & Developed by Pixelle®'}
            </div>
        </div>
      </div>
    </footer>
  );
}
