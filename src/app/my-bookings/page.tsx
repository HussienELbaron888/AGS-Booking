'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";

export default function MyBookingsPage() {
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
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Ticket className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline">{lang === 'en' ? 'My Bookings' : 'حجوزاتي'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {lang === 'en' ? 'This page will display a list of all your reserved events. You will be able to view details and manage your bookings here.' : 'ستعرض هذه الصفحة قائمة بجميع فعالياتك المحجوزة. ستتمكن من عرض التفاصيل وإدارة حجوزاتك هنا.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
