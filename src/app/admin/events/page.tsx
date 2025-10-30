'use client';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { EventsDataTable } from "@/components/admin/events-data-table";
import { useEvents } from "@/hooks/useEvents";
import { useEffect, useState } from "react";

export default function AdminEventsPage() {
    const [lang, setLang] = useState('en');
    const { events, loading } = useEvents();

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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{lang === 'en' ? 'Manage Events' : 'إدارة الأحداث'}</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Add New Event' : 'إضافة حدث جديد'}
          </Link>
        </Button>
      </div>
      <EventsDataTable data={events} />
    </div>
  );
}
