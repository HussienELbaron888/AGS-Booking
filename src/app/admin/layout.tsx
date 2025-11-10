'use client';
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState('en');
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initialLang = document.documentElement.lang || 'en';
    setLang(initialLang);
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

  useEffect(() => {
    // If not loading and no user, and we are not on the login page, redirect to login
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  // While loading, show a loader
  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  // If not a user and not on the login page, the redirect is happening, so we can return null or a loader
  if (!user && pathname !== '/admin/login') {
    return null; // Or a loading spinner
  }

  // If user is not logged in, only render the children (the login page)
  if (!user) {
    return <>{children}</>;
  }

  // If user is logged in, render the admin layout
  return (
    <div className="flex min-h-screen pt-20">
      <AdminSidebar />
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 p-4 md:p-8 bg-muted/30">
        {children}
      </div>
    </div>
  );
}
