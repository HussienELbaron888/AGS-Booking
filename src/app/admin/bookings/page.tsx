'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AdminBookingsPage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setLang(html.lang || 'en');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
    setLang(html.lang || 'en'); // Initial set

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
