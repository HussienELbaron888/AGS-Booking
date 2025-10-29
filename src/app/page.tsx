import { EventList } from '@/components/events/event-list';
import { events } from '@/lib/data';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">
        Upcoming Events
      </h1>
      <p className="text-muted-foreground mb-8">
        Book your seats for our exciting school events.
      </p>
      <EventList events={events} />
    </div>
  );
}
