'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/lib/types';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  image: z.any(),
  targetAudience: z.string().min(1, 'Target audience is required'),
  keyHighlights: z.string().min(1, 'Key highlights are required'),
});

const createEditSchema = (isEdit: boolean) => z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  image: z.any().optional(),
  targetAudience: z.string().min(1, 'Target audience is required'),
  keyHighlights: z.string().min(1, 'Key highlights are required'),
}).refine(data => {
    if (isEdit) return true; // Image is not required for edit
    return data.image?.length > 0;
}, {
    message: 'Image is required',
    path: ['image'],
});

interface EventFormProps {
  event?: Event;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
}

export function EventForm({ event, onSubmit, isSubmitting }: EventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(createEditSchema(!!event)),
    defaultValues: event
      ? { ...event, image: undefined } // Don't load existing image URL into file input
      : {
          name: '',
          date: '',
          time: '',
          description: '',
          longDescription: '',
          image: undefined,
          targetAudience: '',
          keyHighlights: '',
        },
  });

  const imageRef = form.register('image');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              {event?.image && (
                <div className="my-2">
                  <p className="text-sm text-muted-foreground">Current Image:</p>
                  <Image src={event.image} alt="Current event image" width={200} height={100} className="rounded-md object-cover" />
                </div>
              )}
              <FormControl>
                <Input type="file" accept="image/*" {...imageRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Parents, students" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keyHighlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Highlights</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Live performances, awards" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
}
