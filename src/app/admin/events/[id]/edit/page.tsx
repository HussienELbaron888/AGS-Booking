'use client';
import { EventForm } from "@/components/admin/event-form";
import { useEvent } from "@/hooks/useEvent";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    description: z.string().min(1, 'Description is required'),
    longDescription: z.string().min(1, 'Long description is required'),
    image: z.string().min(1, 'Image URL is required'),
    targetAudience: z.string().min(1, 'Target audience is required'),
    keyHighlights: z.string().min(1, 'Key highlights are required'),
  });

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { event, loading } = useEvent(params.id);
  const [lang, setLang] = useState('en');
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setLang(html.lang || 'en');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
    setLang(html.lang || 'en'); // Initial set

    return () => observer.disconnect();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!event) return;
    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, values);
      alert('تم تحديث الحدث بنجاح!');
      router.push('/admin/events');
    } catch (error) {
      console.error('Error updating event: ', error);
      alert('فشل تحديث الحدث.');
    }
  }

  if (loading) {
    return <div>{lang === 'en' ? 'Loading...' : '...جاري التحميل'}</div>
  }

  if (!event) {
    return <div>{lang === 'en' ? 'Event not found' : 'لم يتم العثور على الحدث'}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{lang === 'en' ? 'Edit Event' : 'تعديل الحدث'}</h1>
      <EventForm event={event} onSubmit={onSubmit} />
    </div>
  );
}
