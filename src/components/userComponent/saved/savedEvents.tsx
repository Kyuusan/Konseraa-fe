"use client";

import { useFavorites } from "@/hooks/use-favorites";
import type { ConcertEvent } from "@/types/event";
import { EventCard } from "../eventCatalog/eventCard";
import { ButtonLink } from "../shared/buttonLink";
import { EmptyState } from "../shared/emptyState";

interface SavedEventsProps {
  events: ConcertEvent[];
  /** From the cookie on the server, so the first paint already shows the list. */
  initialIds: string[];
}

// Un-saving a card here removes it right away.
export function SavedEvents({ events, initialIds }: SavedEventsProps) {
  const { ids } = useFavorites();
  const savedIds = ids ?? initialIds;
  const saved = savedIds.flatMap((id) => events.filter((event) => event.id === id));

  if (saved.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="Tap the heart on any event to keep it here for later."
        action={
          <ButtonLink href="/events" className="rounded-full">
            Explore events
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {saved.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
