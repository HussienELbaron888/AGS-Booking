'use client';
import { EventForm } from '@/components/admin/event-form';
import type { Event } from '@/lib/types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';

export default function EditEventPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setEvent({
                id: docSnap.id,
                name: data.name,
                name_ar: data.name_ar,
                description: data.description,
                description_ar: data.description_ar,
                date: data.date,
                time: data.time,
                venue: data.venue,
                totalSeats: data.totalSeats,
                seatsAvailable: data.seatsAvailable,
                image: data.image,
                seatingChart: data.seatingChart,
                keyHighlights: data.keyHighlights,
            } as Event);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      };
      fetchEvent();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      {loading ? (
        <p>Loading event details...</p>
      ) : event ? (
        <EventForm event={event} />
      ) : (
        <p>Event not found.</p>
      )}
    </div>
  );
}
