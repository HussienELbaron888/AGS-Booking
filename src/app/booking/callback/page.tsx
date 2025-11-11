'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Lazy load the cloud function
const verifyPayment = httpsCallable(functions, 'verifyPayment');

function PaymentCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const currentLang = document.documentElement.lang || 'en';
    setLang(currentLang);

    const chargeId = searchParams.get('tap_id');
    const bookingId = searchParams.get('booking_id');

    if (!chargeId || !bookingId) {
      setStatus('error');
      setMessage(currentLang === 'ar' ? 'معلومات التحقق من الدفع غير كاملة.' : 'Missing payment verification information.');
      return;
    }

    const verify = async () => {
      try {
        const result: any = await verifyPayment({ chargeId, bookingId });
        if (result.data.status === 'success') {
          setStatus('success');
          setMessage(result.data.message || (currentLang === 'ar' ? 'تم تأكيد الدفع والحجز بنجاح!' : 'Payment verified and booking confirmed!'));
        } else {
          throw new Error(result.data.message || (currentLang === 'ar' ? 'لم يتم تأكيد الدفع.' : 'Payment was not successful.'));
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || (currentLang === 'ar' ? 'حدث خطأ أثناء التحقق من الدفع.' : 'An error occurred during payment verification.'));
        console.error('Verification Error:', error);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
            {status === 'loading' && (
                <>
                    <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                    <h1 className="text-2xl font-bold">{lang === 'ar' ? 'جارٍ التحقق من الدفع...' : 'Verifying Payment...'}</h1>
                    <p className="text-muted-foreground mt-2">{lang === 'ar' ? 'يرجى عدم إغلاق هذه الصفحة.' : 'Please do not close this page.'}</p>
                </>
            )}
            {status === 'success' && (
                <>
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold">{lang === 'ar' ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}</h1>
                    <p className="text-muted-foreground mt-2">{message}</p>
                    <Button asChild className="mt-6">
                        <Link href="/my-bookings">{lang === 'ar' ? 'عرض حجوزاتي' : 'View My Bookings'}</Link>
                    </Button>
                </>
            )}
            {status === 'error' && (
                <>
                    <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                    <h1 className="text-2xl font-bold">{lang === 'ar' ? 'فشل الدفع' : 'Payment Failed'}</h1>
                    <p className="text-muted-foreground mt-2">{message}</p>
                     <Button asChild className="mt-6" variant="secondary">
                        <Link href="/">{lang === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home'}</Link>
                    </Button>
                </>
            )}
        </div>
    </div>
  );
}

// Use Suspense to handle the initial rendering of searchParams
export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentCallback />
        </Suspense>
    );
}
