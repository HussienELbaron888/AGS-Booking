'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useLanguage } from "@/context/language-context"; // 1. Import the hook

export default function MyBookingsPage() {
  const { lang } = useLanguage(); // 2. Use the hook to get the current language

  // The old useState and useEffect for language have been removed.

  return (
    // 3. Adjust the top padding to push content below the header
    <div className="container mx-auto pt-28 pb-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Ticket className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline">{lang === 'en' ? 'My Bookings' : 'حجوزاتي'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {lang === 'en' ? 'This page will display a list of all your reserved events. You will be able to view details and manage your bookings here.' : 'ستعرض هذه الصفحة قائمة بجميع فعالياتك المحجوزة. ستتمكن من عرض التفاصيل وإدارة حجوزاتك هنا.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
