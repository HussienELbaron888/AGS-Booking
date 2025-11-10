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
      ? { ...event, image: undefined } // Clear image field for file input
      : {
          name: '',
          date: '',
          time: '',
          description: '',
          longDescription: '',
          image: undefined,
          targetAudience: '',
          keyHighlights: '',
          venue: 'boys-theater',
        },
  });

  const isEditing = !!event;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
