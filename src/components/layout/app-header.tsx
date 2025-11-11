'use client';

import Link from 'next/link';
import { Languages, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useLanguage } from '@/context/language-context';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { lang, setLang } = useLanguage(); // Use language from context
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: lang === 'en' ? 'Home' : 'الرئيسية', public: true },
    { href: '/calendar', label: lang === 'en' ? 'Calendar' : 'التقويم', public: true },
    { href: '/my-bookings', label: lang === 'en' ? 'My Bookings' : 'حجوزاتي', public: true },
    { href: '/admin', label: lang === 'en' ? 'Admin Panel' : 'لوحة التحكم', public: false },
  ];

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      'bg-transparent text-white': isHomePage && !isScrolled,
      'bg-background/95 text-foreground border-b shadow-sm backdrop-blur-sm': !isHomePage || isScrolled,
    }
  );
  
  const logoHeight = isHomePage && !isScrolled ? 56 : 40;
  const headerHeight = isHomePage && !isScrolled ? 'h-24' : 'h-20';

  const NavContent = () => (
    <>
      {navLinks.filter(link => link.public || user).map(link => (
        <Button key={link.href} variant="ghost" asChild className={cn(
          "font-semibold text-base transition-colors hover:text-primary",
          { 'text-primary': pathname === link.href, 
            'text-white': isHomePage && !isScrolled,
            'text-foreground': !isHomePage || isScrolled
          }
        )}>
          <Link href={link.href}>
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className={cn(headerClasses, headerHeight)}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/white logo.png" alt="AGS Logo" width={140} height={logoHeight} className={`w-auto transition-all duration-300`} style={{ height: `${logoHeight}px` }} />
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavContent />
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleLang} aria-label={lang === 'en' ? 'Change language' : 'تغيير اللغة'} className={cn({'text-white hover:text-primary': isHomePage && !isScrolled, 'text-foreground hover:text-primary': !isHomePage || isScrolled})}>
            <Languages className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={lang === 'en' ? 'User menu' : 'قائمة المستخدم'} className={cn({'text-white hover:text-primary': isHomePage && !isScrolled, 'text-foreground hover:text-primary': !isHomePage || isScrolled})}>
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {user ? (
                <>
                  <DropdownMenuItem>{lang === 'en' ? 'Profile' : 'الملف الشخصي'}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    {lang === 'en' ? 'Logout' : 'تسجيل الخروج'}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => router.push('/admin/login')}>
                  {lang === 'en' ? 'Login' : 'تسجيل الدخول'}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={lang === 'en' ? 'Open menu' : 'فتح القائمة'} className={cn({'text-white hover:text-primary': isHomePage && !isScrolled, 'text-foreground hover:text-primary': !isHomePage || isScrolled})}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === 'ar' ? 'right' : 'left'}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                     <Link href="/" className="flex items-center gap-3">
                        <Image src="/white logo.png" alt="AGS Logo" width={140} height={56} className="h-14 w-auto" />
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8">
                     {navLinks.filter(link => link.public || user).map(link => (
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
