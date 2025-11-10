'use client';
import { EventForm } from "@/components/admin/event-form";
import { useEvent } from "@/hooks/useEvent";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as z from 'zod';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const formSchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_ar: z.string().min(1, 'Arabic name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  description_en: z.string().min(1, 'English short description is required'),
  description_ar: z.string().min(1, 'Arabic short description is required'),
  longDescription_en: z.string().min(1, 'English long description is required'),
  longDescription_ar: z.string().min(1, 'Arabic long description is required'),
  image: z
    .custom<FileList>()
    .refine((files) => files === undefined || (files && files.length > 0), 'Image is required')
    .refine((files) => files === undefined || (files && Array.from(files).every(file => file.size <= 5 * 1024 * 1024)), `Max file size is 5MB.`)
    .optional(),
  keyHighlights: z.string().min(1, 'Key highlights are required'),
  // Venue is not editable after creation
});

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { event, loading } = useEvent(params.id);
  const [lang, setLang] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!event) return;
    setIsSubmitting(true);
    const eventRef = doc(db, 'events', event.id);
    
    try {
      let imageUrl = event.image;
      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0];
        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }
      
      const updatedEvent = {
        name: values.name_en, // fallback
        name_en: values.name_en,
        name_ar: values.name_ar,
        date: values.date,
        time: values.time,
        description: values.description_en, // fallback
        description_en: values.description_en,
        description_ar: values.description_ar,
        longDescription: values.longDescription_en, // fallback
        longDescription_en: values.longDescription_en,
        longDescription_ar: values.longDescription_ar,
        image: imageUrl,
        keyHighlights: values.keyHighlights,
      };

      await updateDoc(eventRef, updatedEvent);
      alert('Event updated successfully!');
      router.push('/admin/events');
    } catch (serverError) {
      console.error('Error updating event:', serverError);
      const permissionError = new FirestorePermissionError({
        path: eventRef.path,
        operation: 'update',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
      alert('Failed to update event.');
    } finally {
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
      <EventForm event={event} onSubmit={onSubmit} isSubmitting={isSubmitting} schema={formSchema}/>
    </div>
  );
}
