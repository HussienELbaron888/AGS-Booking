import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { EventsDataTable } from "@/components/admin/events-data-table";
import { events } from "@/lib/data";

export default function AdminEventsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Event
          </Link>
        </Button>
      </div>
      <EventsDataTable data={events} />
    </div>
  );
}
