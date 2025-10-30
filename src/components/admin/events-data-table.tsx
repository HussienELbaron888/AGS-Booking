'use client';
import Link from "next/link"
import { useState, useTransition, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import type { Event } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export function EventsDataTable({ data }: { data: Event[] }) {
  const [lang, setLang] = useState('en');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);

    try {
      // Check if the image URL is a Firebase Storage URL before trying to delete
      const isFirebaseStorageUrl = selectedEvent.image.startsWith('gs://') || selectedEvent.image.includes('firebasestorage.googleapis.com');
      
      if (selectedEvent.image && isFirebaseStorageUrl) {
        try {
          const imageRef = ref(storage, selectedEvent.image);
          await deleteObject(imageRef);
        } catch (error: any) {
          // It's okay if the image doesn't exist, we can still delete the doc
          if (error.code !== 'storage/object-not-found') {
            // But if it's another error, we should probably log it.
            console.warn("Could not delete image from storage:", error);
          }
        }
      }

      // Delete document from firestore
      await deleteDoc(doc(db, "events", selectedEvent.id));

      alert('Event deleted successfully!');
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert('Failed to delete event.');
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
      setSelectedEvent(null);
    }
  };

  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsAlertOpen(true);
  };


  return (
    <>
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{lang === 'en' ? 'Name' : 'الاسم'}</TableHead>
            <TableHead>{lang === 'en' ? 'Date' : 'التاريخ'}</TableHead>
            <TableHead>{lang === 'en' ? 'Time' : 'الوقت'}</TableHead>
            <TableHead className="text-right">{lang === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{lang === 'en' ? 'Actions' : 'الإجراءات'}</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/events/${event.id}`}>
                            <Eye className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                            {lang === 'en' ? 'View' : 'عرض'}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/events/${event.id}/edit`}> 
                            <Pencil className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                            {lang === 'en' ? 'Edit' : 'تعديل'}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={() => openDeleteDialog(event)}
                      >
                        <Trash2 className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {lang === 'en' ? 'Delete' : 'حذف'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {lang === 'en' ? 'No events found.' : 'لم يتم العثور على أحداث.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>{lang === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'en' ? "This action cannot be undone. This will permanently delete the event and its data from our servers." : "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الحدث وبياناته بشكل دائم من خوادمنا."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEvent(null)}>{lang === 'en' ? 'Cancel' : 'إلغاء'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (lang === 'en' ? 'Deleting...' : '...جاري الحذف') : (lang === 'en' ? 'Delete' : 'حذف')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
