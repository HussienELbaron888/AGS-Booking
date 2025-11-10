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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface EventFormProps {
  event?: Event;
  onSubmit: (values: z.infer<any>) => void;
  isSubmitting?: boolean;
  schema: z.ZodObject<any, any, any>;
}

export function EventForm({ event, onSubmit, isSubmitting, schema }: EventFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: event
      ? { 
          ...event,
          name_en: event.name_en || event.name,
          name_ar: event.name_ar || '',
          description_en: event.description_en || event.description,
          description_ar: event.description_ar || '',
          image: undefined 
        }
      : {
          name_en: '',
          name_ar: '',
          date: '',
          time: '',
          description_en: '',
          description_ar: '',
          image: undefined,
          keyHighlights: '',
          venue: 'boys-theater',
        },
  });

  const isEditing = !!event;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        {!isEditing && (
            <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="boys-theater" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Boys' Theater
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="girls-theater" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Girls' Theater
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input placeholder="Event name in English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (Arabic)</FormLabel>
                <FormControl>
                  <Input placeholder="اسم الحدث بالعربية" {...field} dir="rtl"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        <FormField
          control={form.control}
          name="description_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description (English)</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description (Arabic)</FormLabel>
              <FormControl>
                <Textarea placeholder="وصف مختصر" {...field} dir="rtl"/>
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
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
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
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
}
