'use client';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { EventsDataTable } from "@/components/admin/events-data-table";
import { events } from "@/lib/data";
import { useEffect, useState } from "react";

export default function AdminEventsPage() {
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
