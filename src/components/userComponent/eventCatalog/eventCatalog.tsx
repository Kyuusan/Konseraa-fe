"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/components/radix/sheet";
import type { ConcertEvent } from "@/types/event";
import { EmptyState } from "../shared/emptyState";
import { CatalogFiltersForm } from "./catalogFilters";
import { CatalogSearch } from "./catalogSearch";
import { EventCard } from "./eventCard";
import { type CatalogFilters, countActiveFilters, DEFAULT_FILTERS, filterEvents } from "./filterEvents";

interface EventCatalogProps {
  events: ConcertEvent[];
  cities: string[];
  genres: string[];
  /** Filters to start from, e.g. a genre or city picked on the home page. */
  initialFilters?: CatalogFilters;
}

export function EventCatalog({ events, cities, genres, initialFilters = DEFAULT_FILTERS }: EventCatalogProps) {
  const [filters, setFilters] = useState(initialFilters);
  const results = filterEvents(events, filters);
  const activeCount = countActiveFilters(filters);
  const form = <CatalogFiltersForm filters={filters} onChange={setFilters} cities={cities} genres={genres} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-28 rounded-[20px] bg-bg-surface p-5">{form}</div>
      </aside>

      <section aria-label="Events" className="space-y-5">
        <div className="flex items-center gap-3">
          <p className="mr-auto shrink-0 text-sm text-text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "event" : "events"}
          </p>
          <CatalogSearch value={filters.query} onChange={(query) => setFilters((current) => ({ ...current, query }))} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" hoverScale={1} className="h-12 shrink-0 rounded-full lg:hidden">
                <SlidersHorizontal />
                Filters{activeCount > 0 && ` (${activeCount})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto bg-bg-surface p-6" data-lenis-prevent>
              <SheetHeader className="p-0 pb-4">
                <SheetTitle className="font-heading text-xl">Filters</SheetTitle>
                <SheetDescription>Narrow the catalogue by city, genre, date and price.</SheetDescription>
              </SheetHeader>
              {form}
            </SheetContent>
          </Sheet>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {results.map((event, index) => (
              <EventCard key={event.id} event={event} priority={index < 3} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No events match"
            description="Try another search, city or genre, or widen the date and price range."
            action={
              <Button variant="outline" hoverScale={1} className="rounded-full" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Reset filters
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
