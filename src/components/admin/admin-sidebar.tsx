'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarPlus, BarChart3, Users, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function AdminSidebar() {
  const pathname = usePathname();
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

  const navItems = [
    { href: '/admin', label: lang === 'en' ? 'Dashboard' : 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/events', label: lang === 'en' ? 'Events' : 'الأحداث', icon: CalendarPlus },
    { href: '/admin/bookings', label: lang === 'en' ? 'Bookings' : 'الحجوزات', icon: Ticket },
    { href: '/admin/analytics', label: lang === 'en' ? 'Analytics' : 'التحليلات', icon: BarChart3 },
    { href: '/admin/users', label: lang === 'en' ? 'Users' : 'المستخدمون', icon: Users },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex-col hidden md:flex">
      <div className="p-4 border-b">
         <Link href="/admin" className="flex items-center gap-2 text-lg font-bold font-headline text-primary">
            {lang === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
         </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                isActive && 'bg-muted text-primary font-semibold'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
