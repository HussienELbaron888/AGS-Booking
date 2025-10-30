'use client';
import Link from "next/link"

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
import { useEffect, useState } from "react";

export function EventsDataTable({ data }: { data: Event[] }) {
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

  return (
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
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
  )
}
