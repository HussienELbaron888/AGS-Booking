"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, WandSparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateEventDescription } from "@/ai/flows/generate-event-description";
import { useTransition } from "react";

const formSchema = z.object({
  eventName: z.string().min(3, "Event name must be at least 3 characters."),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  eventTime: z.string().min(1, "Time is required."),
  eventDescription: z.string().min(10, "Description must be at least 10 characters."),
  targetAudience: z.string().min(3, "Target audience must be at least 3 characters."),
  keyHighlights: z.string().min(3, "Key highlights must be at least 3 characters."),
  promotionalText: z.string().optional(),
});

type EventFormData = z.infer<typeof formSchema>;

export function EventForm() {
  const { toast } = useToast();
  const [isGenerating, startGeneratingTransition] = useTransition();

  const form = useForm<EventFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDate: "",
      eventTime: "",
      eventDescription: "",
      targetAudience: "",
      keyHighlights: "",
      promotionalText: "",
    },
  });

  const handleGenerateContent = () => {
    const values = form.getValues();
    const inputForAI = {
      eventName: values.eventName,
      eventDate: values.eventDate,
      eventTime: values.eventTime,
      eventDescription: values.eventDescription,
      targetAudience: values.targetAudience,
      keyHighlights: values.keyHighlights,
    };

    // Simple validation
    if (!inputForAI.eventName || !inputForAI.eventDate || !inputForAI.eventDescription) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Event Name, Date, and a brief Description before generating.",
      });
      return;
    }
    
    startGeneratingTransition(async () => {
      try {
        const result = await generateEventDescription(inputForAI);
        form.setValue("eventDescription", result.description, { shouldValidate: true });
        form.setValue("promotionalText", result.promotionalText, { shouldValidate: true });
        toast({
          title: "Content Generated!",
          description: "The description and promotional text have been updated.",
        });
      } catch (error) {
        console.error("AI Generation Error:", error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate content. Please try again.",
        });
      }
    });
  };

  function onSubmit(values: EventFormData) {
    console.log(values);
    toast({
      title: "Event Saved",
      description: "The event details have been successfully saved.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Annual School Play" {...field} />
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
                name="eventDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="eventTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Event Time</FormLabel>
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
                name="keyHighlights"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Key Highlights</FormLabel>
                    <FormControl>
                        <Textarea placeholder="List key attractions, speakers, or activities..." {...field} />
                    </FormControl>
                     <FormDescription>
                        Used by the AI to generate more engaging content.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="eventDescription"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Full Event Description</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating}>
                        {isGenerating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <WandSparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate with AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea rows={6} placeholder="A detailed description of the event..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionalText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotional Text (for Social Media/Ads)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="AI-generated promotional text will appear here." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Event</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
