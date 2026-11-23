import Image from "next/image";
import type { ReactNode } from "react";
import { formatNumber } from "@/lib/format";
import type { OrganizerEvent } from "@/types/organizer";
import { VENUE_TYPE_LABELS } from "../eventWizard/wizardValues";

interface EventFactsProps {
  event: OrganizerEvent;
  /** Published events show the poster and description in the edit form instead. */
  showContent: boolean;
  note?: string;
}

export function EventFacts({ event, showContent, note }: EventFactsProps) {
  const { venue } = event;

  return (
    <section aria-labelledby="facts-heading" className="space-y-5 rounded-[20px] bg-bg-surface p-6">
      <div className="space-y-1">
        <h2 id="facts-heading" className="font-heading text-xl font-semibold">Event details</h2>
        {note && <p className="text-sm text-text-primary/70">{note}</p>}
      </div>

      {showContent && (
        <div className="flex gap-4">
          <div className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-xl bg-bg-surface-2">
            <Image src={event.poster_url} alt="Poster" fill sizes="96px" className="object-cover" />
          </div>
          <p className="line-clamp-6 text-sm text-text-primary/80">{event.description}</p>
        </div>
      )}

      <dl className="divide-y divide-text-primary/10 text-sm">
        <Fact label="Venue">{venue.name}</Fact>
        <Fact label="City">{venue.city}</Fact>
        <Fact label="Setting">{VENUE_TYPE_LABELS[venue.type]}</Fact>
        <Fact label="Capacity">{formatNumber(venue.total_capacity)}</Fact>
        <Fact label="Time zone">{venue.timezone}</Fact>
        <Fact label="Categories">{event.categories.join(", ")}</Fact>
      </dl>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-text-primary/70">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
