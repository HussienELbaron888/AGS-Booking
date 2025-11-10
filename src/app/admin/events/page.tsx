'use client';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EventsDataTable } from "@/components/admin/events-data-table";
import { useEvents } from "@/hooks/useEvents";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/admin/event-form";
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { generateSeats } from '@/lib/seats';
import { generateSeatsGirls } from '@/lib/seats-girls';
import * as z from 'zod';
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { SeatingChart } from "@/lib/types";

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
    .refine((files) => files && files.length > 0, 'Image is required')
    .refine((files) => files && Array.from(files).every(file => file.size <= 5 * 1024 * 1024), `Max file size is 5MB.`),
  keyHighlights: z.string().min(1, 'Key highlights are required'),
  venue: z.enum(['boys-theater', 'girls-theater'], {
    required_error: "You need to select a venue.",
  }),
});


export default function AdminEventsPage() {
    const [lang, setLang] = useState('en');
    const { events, loading } = useEvents();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const countAvailableSeats = (seatingChart: SeatingChart) => {
      return seatingChart.rows.reduce((count, row) => {
        return count + row.seats.filter(seat => seat.type === 'seat').length;
      }, 0);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsSubmitting(true);
      const eventsCollection = collection(db, 'events');
  
      try {
        const imageFile = values.image[0];
        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        
        const seatingChart = values.venue === 'boys-theater' ? generateSeats() : generateSeatsGirls();
        const availableSeats = countAvailableSeats(seatingChart);
  
        const newEventData = {
          name: values.name_en, // Fallback name
          name_en: values.name_en,
          name_ar: values.name_ar,
          date: values.date,
          time: values.time,
          description: values.description_en, // Fallback
          description_en: values.description_en,
          description_ar: values.description_ar,
          longDescription: values.longDescription_en, // Fallback
          longDescription_en: values.longDescription_en,
          longDescription_ar: values.longDescription_ar,
          image: imageUrl,
          keyHighlights: values.keyHighlights,
          venue: values.venue,
          seatingChart: seatingChart,
          totalSeats: availableSeats,
          seatsAvailable: availableSeats
        };
        
        await addDoc(eventsCollection, newEventData);
        
        alert('Event added successfully!');
        setIsModalOpen(false); // Close modal on success
  
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{lang === 'en' ? 'Manage Events' : 'إدارة الأحداث'}</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {lang === 'en' ? 'Add New Event' : 'إضافة حدث جديد'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{lang === 'en' ? 'Create New Event' : 'إنشاء حدث جديد'}</DialogTitle>
                </DialogHeader>
                <EventForm onSubmit={onSubmit} isSubmitting={isSubmitting} schema={formSchema} />
            </DialogContent>
        </Dialog>
      </div>
      <EventsDataTable data={events} />
    </div>
  );
}
