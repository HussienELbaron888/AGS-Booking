'use client';
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    if (html) {
      const observer = new MutationObserver(() => {
        setLang(html.lang || 'en');
      });
      observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
      setLang(html.lang || 'en'); // Initial set

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
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
