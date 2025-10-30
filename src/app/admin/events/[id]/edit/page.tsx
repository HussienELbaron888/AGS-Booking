'use client';
import { EventForm } from "@/components/admin/event-form";
import { useEvent } from "@/hooks/useEvent";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import * as z from 'zod';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    description: z.string().min(1, 'Description is required'),
    longDescription: z.string().min(1, 'Long description is required'),
    image: z.any().optional(),
    targetAudience: z.string().min(1, 'Target audience is required'),
    keyHighlights: z.string().min(1, 'Key highlights are required'),
});

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { event, loading } = useEvent(params.id);
  const [lang, setLang] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
        let imageUrl = event.image;
        const imageFile = values.image?.[0];

        if (imageFile) {
            const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        const updatedData = { ...values, image: imageUrl };
        
        const eventRef = doc(db, 'events', event.id);
        updateDoc(eventRef, updatedData)
          .then(() => {
            alert('تم تحديث الحدث بنجاح!');
            router.push('/admin/events');
          })
          .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: eventRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
            alert('فشل تحديث الحدث.');
            setIsSubmitting(false);
          });

    } catch (error) {
        console.error('Error updating event:', error);
        alert('فشل تحديث الحدث.');
        setIsSubmitting(false);
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
      <EventForm event={event} onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
