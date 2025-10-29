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
  eventName: z.string().min(3, "يجب أن يكون اسم الحدث 3 أحرف على الأقل."),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "صيغة التاريخ غير صالحة." }),
  eventTime: z.string().min(1, "الوقت مطلوب."),
  eventDescription: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل."),
  targetAudience: z.string().min(3, "يجب أن يكون الجمهور المستهدف 3 أحرف على الأقل."),
  keyHighlights: z.string().min(3, "يجب أن تكون النقاط الرئيسية 3 أحرف على الأقل."),
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
        title: "معلومات ناقصة",
        description: "يرجى ملء اسم الحدث والتاريخ ووصف موجز قبل الإنشاء.",
      });
      return;
    }
    
    startGeneratingTransition(async () => {
      try {
        const result = await generateEventDescription(inputForAI);
        form.setValue("eventDescription", result.description, { shouldValidate: true });
        form.setValue("promotionalText", result.promotionalText, { shouldValidate: true });
        toast({
          title: "تم إنشاء المحتوى!",
          description: "تم تحديث الوصف والنص الترويجي.",
        });
      } catch (error) {
        console.error("AI Generation Error:", error);
        toast({
          variant: "destructive",
          title: "فشل الإنشاء",
          description: "ไม่สามารถสร้างเนื้อหาได้ กรุณาลองใหม่อีกครั้ง",
        });
      }
    });
  };

  function onSubmit(values: EventFormData) {
    console.log(values);
    toast({
      title: "تم حفظ الحدث",
      description: "تم حفظ تفاصيل الحدث بنجاح.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>تفاصيل الحدث</CardTitle>
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
                    <FormLabel>اسم الحدث</FormLabel>
                    <FormControl>
                        <Input placeholder="مثال: مسرحية المدرسة السنوية" {...field} />
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
                    <FormLabel>الجمهور المستهدف</FormLabel>
                    <FormControl>
                        <Input placeholder="مثال: الآباء والطلاب" {...field} />
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
                    <FormLabel>تاريخ الحدث</FormLabel>
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
                    <FormLabel>وقت الحدث</FormLabel>
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
                    <FormLabel>أهم النقاط</FormLabel>
                    <FormControl>
                        <Textarea placeholder="اذكر أهم عوامل الجذب أو المتحدثين أو الأنشطة..." {...field} />
                    </FormControl>
                     <FormDescription>
                        يستخدمها الذكاء الاصطناعي لإنشاء محتوى أكثر جاذبية.
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
                    <FormLabel>الوصف الكامل للحدث</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating}>
                        {isGenerating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <WandSparkles className="mr-2 h-4 w-4" />
                        )}
                        إنشاء بواسطة الذكاء الاصطناعي
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea rows={6} placeholder="وصف تفصيلي للحدث..." {...field} />
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
                  <FormLabel>نص ترويجي (لوسائل التواصل الاجتماعي / الإعلانات)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="سيظهر النص الترويجي الذي تم إنشاؤه بواسطة الذكاء الاصطناعي هنا." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">حفظ الحدث</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
