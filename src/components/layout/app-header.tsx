'use client';

import Link from 'next/link';
import { Languages, Ticket, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AppHeader() {
  const pathname = usePathname();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const navLinks = [
    { href: '/', label: lang === 'en' ? 'Events' : 'الأحداث' },
    { href: '/admin', label: lang === 'en' ? 'Admin' : 'الإدارة' },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
          <Ticket className="text-accent" />
          <span>{'AGS Booking'}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname === link.href ? 'text-accent' : 'text-primary-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLang}>
            <Languages className="h-5 w-5" />
            <span className="sr-only">
              {lang === 'en' ? 'Change language' : 'تغيير اللغة'}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">
                  {lang === 'en' ? 'User menu' : 'قائمة المستخدم'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuItem>
                {lang === 'en' ? 'My Bookings' : 'حجوزاتي'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {lang === 'en' ? 'Profile' : 'الملف الشخصي'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {lang === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
