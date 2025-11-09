'use client';
import { EventForm } from "@/components/admin/event-form";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { generateSeats } from '@/lib/seats';
import * as z from 'zod';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  image: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'Image is required')
    .refine((files) => files && Array.from(files).every(file => file.size <= 5 * 1024 * 1024), `Max file size is 5MB.`),
  targetAudience: z.string().min(1, 'Target audience is required'),
  keyHighlights: z.string().min(1, 'Key highlights are required'),
});

export default function NewEventPage() {
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
    setIsSubmitting(true);
    const eventsCollection = collection(db, 'events');

    try {
      const imageFile = values.image[0];
      const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      
      const newEventData = {
        name: values.name,
        date: values.date,
        time: values.time,
        description: values.description,
        longDescription: values.longDescription,
        image: imageUrl,
        targetAudience: values.targetAudience,
        keyHighlights: values.keyHighlights,
        seatingChart: generateSeats(),
      };
      
      await addDoc(eventsCollection, newEventData);
      
      alert('Event added successfully!');
      router.push('/admin/events');

    } catch (serverError: any) {
      console.error('Error adding event:', serverError);
      
      const permissionError = new FirestorePermissionError({
        path: eventsCollection.path,
        operation: 'create',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);

      alert(`Failed to add event. Error: ${serverError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{lang === 'en' ? 'Create New Event' : 'إنشاء حدث جديد'}</h1>
      <EventForm onSubmit={onSubmit} isSubmitting={isSubmitting} schema={formSchema} />
    </div>
  );
}
