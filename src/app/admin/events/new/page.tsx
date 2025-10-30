'use client';
import { EventForm } from "@/components/admin/event-form";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { generateSeats } from '@/lib/seats';
import * as z from 'zod';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    description: z.string().min(1, 'Description is required'),
    longDescription: z.string().min(1, 'Long description is required'),
    image: z.any().refine(files => files?.length > 0, 'Image is required'),
    targetAudience: z.string().min(1, 'Target audience is required'),
    keyHighlights: z.string().min(1, 'Key highlights are required'),
  });

export default function NewEventPage() {
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
    setIsSubmitting(true);
    try {
      const imageFile = values.image[0];
      const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const eventData = { ...values, image: imageUrl };
      
      const newEvent = {
        ...eventData,
        seatingChart: generateSeats(),
      };
      
      const eventsCollection = collection(db, 'events');
      addDoc(eventsCollection, newEvent)
        .then(() => {
            alert('Event added successfully!');
            router.push('/admin/events');
        })
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: eventsCollection.path,
                operation: 'create',
                requestResourceData: newEvent,
            });
            errorEmitter.emit('permission-error', permissionError);
            alert('Failed to add event.');
            setIsSubmitting(false);
        });

    } catch (error) {
      console.error('Error adding event: ', error);
      alert('Failed to add event.');
      setIsSubmitting(false);
    }
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{lang === 'en' ? 'Create New Event' : 'إنشاء حدث جديد'}</h1>
      <EventForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
