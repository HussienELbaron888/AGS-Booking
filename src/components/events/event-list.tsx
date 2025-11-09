import type { Event } from '@/lib/types';
import { EventCard } from './event-card';
import { Skeleton } from '../ui/skeleton';

interface EventListProps {
  events: Event[];
  loading: boolean;
}

const EventCardSkeleton = () => (
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-52 w-full rounded-lg" />
        <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="border-t pt-4">
             <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-24" />
             </div>
        </div>
    </div>
)

export function EventList({ events, loading }: EventListProps) {
    if (loading) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
            </div>
        )
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
