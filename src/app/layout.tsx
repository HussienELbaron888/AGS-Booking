import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/layout/app-header';
import { FirebaseProvider } from '@/firebase/provider';
import { AppFooter } from '@/components/layout/app-footer';
import { Providers } from '@/context/providers'; // Import the new Providers component

export const metadata: Metadata = {
  title: 'AGS Booking',
  description: 'School Event Seating and Reservation System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute will be dynamically set by the LanguageProvider on the client side
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-secondary/30">
        {/* Wrap the application with the new Providers component */}
        <Providers>
          <FirebaseProvider>
            <AppHeader />
            <main className="flex-grow">{children}</main>
            <AppFooter />
            <Toaster />
          </FirebaseProvider>
        </Providers>
      </body>
    </html>
  );
}
