'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{lang === 'en' ? 'Dashboard' : 'لوحة التحكم'}</h1>
        <Button asChild>
            <Link href="/admin/events/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {lang === 'en' ? 'Add New Event' : 'إضافة حدث جديد'}
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{lang === 'en' ? 'Welcome to the Admin Panel' : 'مرحباً بك في لوحة الإدارة'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {lang === 'en' ? 'Use the sidebar to manage events, bookings, users, and view analytics.' : 'استخدم الشريط الجانبي لإدارة الأحداث والحجوزات والمستخدمين وعرض التحليلات.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
