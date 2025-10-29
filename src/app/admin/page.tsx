'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Ticket, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
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
    <div>
      <h1 className="text-3xl font-bold mb-6">{lang === 'en' ? 'Dashboard' : 'لوحة التحكم'}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{lang === 'en' ? 'Total Events' : 'إجمالي الأحداث'}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Currently scheduled events' : 'الأحداث المجدولة حاليًا'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{lang === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'Across all events' : 'عبر جميع الأحداث'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{lang === 'en' ? 'Registered Users' : 'المستخدمون المسجلون'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? 'New users this month' : 'مستخدمون جدد هذا الشهر'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{lang === 'en' ? 'Revenue' : 'الإيرادات'}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-muted-foreground">
              {lang === 'en' ? '+10.1% from last month' : '+10.1٪ من الشهر الماضي'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{lang === 'en' ? 'Recent Activity' : 'النشاط الأخير'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{lang === 'en' ? 'Activity feed will be shown here.' : 'سيتم عرض موجز النشاط هنا.'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
