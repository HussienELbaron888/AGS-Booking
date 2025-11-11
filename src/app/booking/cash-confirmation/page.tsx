'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CashConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [lang, setLang] = useState('en');

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

  if (!bookingId) {
    return (
        <div className="container mx-auto py-10 px-4 text-center">
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle className="text-destructive">{lang === 'ar' ? 'خطأ' : 'Error'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{lang === 'ar' ? 'معرف الحجز غير موجود.' : 'Booking ID not found.'}</p>
                    <Button onClick={() => router.push('/')} className="mt-4">
                        {lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 text-center">
        <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <CardTitle className="text-3xl font-headline text-primary">{lang === 'ar' ? 'تم استلام طلب الحجز' : 'Booking Request Received'}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <p className="text-lg text-muted-foreground mb-4">
                    {lang === 'ar' 
                        ? `لقد تم حجز مقاعدك مؤقتاً. رقم الحجز الخاص بك هو:` 
                        : `Your seats have been temporarily reserved. Your booking ID is:`
                    }
                </p>
                <p className="text-2xl font-bold bg-secondary text-secondary-foreground rounded-md inline-block px-4 py-2 mb-6">{bookingId}</p>
                
                <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md text-start flex items-center gap-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <Clock className="h-8 w-8 text-amber-600 shrink-0"/>
                    <div>
                        <h3 className="font-bold">{lang === 'ar' ? 'الحجز مؤقت' : 'Temporary Reservation'}</h3>
                        <p>
                        {lang === 'ar' 
                            ? 'هذا الحجز سيبقى مؤقتاً لمدة 48 ساعة. لإتمام الحجز، يرجى الدفع نقداً لدى مكتبنا. إذا لم يتم تأكيد الدفع خلال هذه المدة، سيتم إلغاء الحجز تلقائياً.' 
                            : 'This reservation is temporary and will be held for 48 hours. To complete your booking, please complete the payment at our office. If payment is not confirmed within this period, the reservation will be automatically cancelled.'
                        }
                        </p>
                    </div>
                </div>

                <Button onClick={() => router.push('/my-bookings')} className="mt-8">
                    {lang === 'ar' ? 'عرض حجوزاتي' : 'View My Bookings'}
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}

export default function CashConfirmationPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin"/></div>}>
            <CashConfirmationContent />
        </Suspense>
    )
}
