'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AdminBookingsPage() {
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
    <Card>
      <CardHeader>
        <CardTitle>{lang === 'en' ? 'Manage Bookings' : 'إدارة الحجوزات'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {lang === 'en' ? 'This is where you would manage all event bookings, view details, and handle refunds or cancellations. A list of all bookings would be displayed here in a data table.' : 'هنا يمكنك إدارة جميع حجوزات الأحداث وعرض التفاصيل والتعامل مع المبالغ المستردة أو الإلغاءات. سيتم عرض قائمة بجميع الحجوزات هنا في جدول بيانات.'}
        </p>
      </CardContent>
    </Card>
  );
}
