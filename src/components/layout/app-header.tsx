'use client';

import Link from 'next/link';
import { Languages, User, Menu, X, CalendarDays, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();
  const [lang, setLang] = useState('en');
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialLang = document.documentElement.lang || 'en';
    setLang(initialLang);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isClient) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang, isClient]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const navLinks = [
    { href: '/', label: lang === 'en' ? 'Home' : 'الرئيسية' },
    { href: '/calendar', label: lang === 'en' ? 'Calendar' : 'التقويم' },
    { href: '/my-bookings', label: lang === 'en' ? 'My Bookings' : 'حجوزاتي' },
    { href: '/admin', label: lang === 'en' ? 'Admin Panel' : 'لوحة التحكم' },
  ];

  const NavContent = () => (
    <>
      {navLinks.map(link => (
        <Button key={link.href} variant="ghost" asChild className={cn("font-semibold text-base transition-colors hover:text-primary", { 'text-primary': pathname === link.href })}>
          <Link href={link.href}>
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", isScrolled ? "bg-background/95 border-b shadow-sm backdrop-blur-sm" : "bg-background")}>
      <div className="container mx-auto flex items-center justify-between p-4 h-20">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/white logo.png" alt="AGS Logo" width={100} height={40} className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavContent />
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleLang} aria-label={lang === 'en' ? 'Change language' : 'تغيير اللغة'}>
            <Languages className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={lang === 'en' ? 'User menu' : 'قائمة المستخدم'}>
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuItem>{lang === 'en' ? 'Profile' : 'الملف الشخصي'}</DropdownMenuItem>
              <DropdownMenuItem>{lang === 'en' ? 'Logout' : 'تسجيل الخروج'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={lang === 'en' ? 'Open menu' : 'فتح القائمة'}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === 'ar' ? 'right' : 'left'}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                     <Link href="/" className="flex items-center gap-3">
                        <Image src="/white logo.png" alt="AGS Logo" width={100} height={40} className="h-10 w-auto" />
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8">
                     {navLinks.map(link => (
                        <SheetClose asChild key={link.href}>
                           <Link href={link.href} className={cn("font-semibold text-lg p-2 rounded-md transition-colors hover:bg-muted", { 'bg-muted text-primary': pathname === link.href })}>
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
