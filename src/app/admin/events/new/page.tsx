'use client';
import { EventForm } from "@/components/admin/event-form";
import { useEffect, useState } from "react";

export default function NewEventPage() {
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
      <h1 className="text-3xl font-bold mb-6">{lang === 'en' ? 'Create New Event' : 'إنشاء حدث جديد'}</h1>
      <EventForm />
    </div>
  );
}
