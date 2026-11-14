import type { ConcertEvent } from "@/types/event";
import { EventCard } from "./eventCard";

// Horizontal, swipeable row of featured events (PRD §13.1 "Featured Events").
export function FeaturedRow({ events }: { events: ConcertEvent[] }) {
  return (
    <div className="-mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-2 scrollbar-none sm:-mx-6 sm:px-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} priority={index === 0} className="w-44 shrink-0 snap-start sm:w-72" />
      ))}
    </div>
  );
}
