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
import { useEffect, useState, useTransition } from "react";

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
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setLang(html.lang || 'en');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
    setLang(html.lang || 'en'); // Initial set

    return () => observer.disconnect();
  }, []);

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
        title: lang === 'ar' ? "معلومات ناقصة" : "Missing Information",
        description: lang === 'ar' ? "يرجى ملء اسم الحدث وتاريخه ووصف موجز قبل الإنشاء." : "Please fill in the event name, date, and a brief description before generating.",
      });
      return;
    }
    
    startGeneratingTransition(async () => {
      try {
        const result = await generateEventDescription(inputForAI);
        form.setValue("eventDescription", result.description, { shouldValidate: true });
        form.setValue("promotionalText", result.promotionalText, { shouldValidate: true });
        toast({
          title: lang === 'ar' ? "تم إنشاء المحتوى!" : "Content Generated!",
          description: lang === 'ar' ? "تم تحديث الوصف والنص الترويجي." : "The description and promotional text have been updated.",
        });
      } catch (error) {
        console.error("AI Generation Error:", error);
        toast({
          variant: "destructive",
          title: lang === 'ar' ? "فشل الإنشاء" : "Generation Failed",
          description: lang === 'ar' ? "ไม่สามารถสร้างเนื้อหาได้ กรุณาลองใหม่" : "Could not generate content. Please try again.",
        });
      }
    });
  };

  function onSubmit(values: EventFormData) {
    console.log(values);
    toast({
      title: lang === 'ar' ? "تم حفظ الحدث" : "Event Saved",
      description: lang === 'ar' ? "تم حفظ تفاصيل الحدث بنجاح." : "The event details have been saved successfully.",
    });
  }

  return (
    <Card dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle>{lang === 'ar' ? "تفاصيل الحدث" : "Event Details"}</CardTitle>
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
                    <FormLabel>{lang === 'ar' ? "اسم الحدث" : "Event Name"}</FormLabel>
                    <FormControl>
                        <Input placeholder={lang === 'ar' ? "مثال: مسرحية المدرسة السنوية" : "e.g., Annual School Play"} {...field} />
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
                    <FormLabel>{lang === 'ar' ? "الجمهور المستهدف" : "Target Audience"}</FormLabel>
                    <FormControl>
                        <Input placeholder={lang === 'ar' ? "مثال: الآباء والطلاب" : "e.g., Parents, Students"} {...field} />
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
                    <FormLabel>{lang === 'ar' ? "تاريخ الحدث" : "Event Date"}</FormLabel>
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
                    <FormLabel>{lang === 'ar' ? "وقت الحدث" : "Event Time"}</FormLabel>
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
                    <FormLabel>{lang === 'ar' ? "أبرز النقاط" : "Key Highlights"}</FormLabel>
                    <FormControl>
                        <Textarea placeholder={lang === 'ar' ? "اذكر أبرز الفعاليات، المتحدثين، الأنشطة..." : "List main attractions, speakers, activities..."} {...field} />
                    </FormControl>
                     <FormDescription>
                        {lang === 'ar' ? "يستخدم هذا بواسطة الذكاء الاصطناعي لتوليد محتوى أكثر جاذبية." : "This is used by the AI to generate more engaging content."}
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
                    <FormLabel>{lang === 'ar' ? "الوصف الكامل للحدث" : "Full Event Description"}</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating}>
                        {isGenerating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <WandSparkles className="mr-2 h-4 w-4" />
                        )}
                        {lang === 'ar' ? "إنشاء بواسطة الذكاء الاصطناعي" : "Generate with AI"}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea rows={6} placeholder={lang === 'ar' ? "وصف مفصل للحدث..." : "A detailed description of the event..."} {...field} />
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
                  <FormLabel>{lang === 'ar' ? "نص ترويجي (لوسائل التواصل الاجتماعي / الإعلانات)" : "Promotional Text (for Social Media / Ads)"}</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder={lang === 'ar' ? "سيظهر النص الترويجي الذي تم إنشاؤه بواسطة الذكاء الاصطناعي هنا." : "AI-generated promotional text will appear here."} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{lang === 'ar' ? "حفظ الحدث" : "Save Event"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
