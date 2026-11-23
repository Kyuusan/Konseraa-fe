"use client";

import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { SeatMapPreview } from "@/components/userComponent/shared/seatMapPreview";
import { TIER_TYPE_LABELS } from "@/lib/constants";
import { formatNumber, formatPrice } from "@/lib/format";
import { TIMEZONES, VENUE_TYPE_LABELS, type EventWizardValues } from "../wizardValues";

const sessionDate = new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

interface ReviewStepProps {
  values: EventWizardValues;
  onEdit: (step: number) => void;
}

export function ReviewStep({ values, onEdit }: ReviewStepProps) {
  const { basics, venue, sessions, tiers, seatMap } = values;
  const timezone = TIMEZONES.find((zone) => zone.value === venue.timezone)?.label ?? venue.timezone;

  return (
    <div className="space-y-6">
      <ReviewSection title="Basics" onEdit={() => onEdit(0)}>
        <Row label="Title">{basics.title}</Row>
        <Row label="Categories">{basics.categories.join(", ")}</Row>
        <Row label="Description">
          <span className="line-clamp-3 whitespace-pre-line">{basics.description}</span>
        </Row>
        <Row label="Artwork">
          {basics.poster?.name} · {basics.banner?.name}
        </Row>
      </ReviewSection>

      <ReviewSection title="Venue" onEdit={() => onEdit(1)}>
        <Row label="Venue">
          {venue.name} · {VENUE_TYPE_LABELS[venue.type]}
        </Row>
        <Row label="Address">
          {venue.address}, {venue.city}
        </Row>
        <Row label="Time zone">{timezone}</Row>
        <Row label="Capacity">{formatNumber(Number(venue.capacity))}</Row>
        <Row label="Permit">{venue.permit?.name}</Row>
      </ReviewSection>

      <ReviewSection title={`Sessions (${sessions.length})`} onEdit={() => onEdit(2)}>
        {sessions.map((session) => (
          <Row key={session.key} label={session.name}>
            {sessionDate.format(new Date(`${session.date}T00:00:00`))} · {session.start}–{session.end}
            <span className="block text-text-primary/70">{session.lineup}</span>
          </Row>
        ))}
      </ReviewSection>

      <ReviewSection title={`Ticket tiers (${tiers.length})`} onEdit={() => onEdit(3)}>
        {tiers.map((tier) => (
          <Row key={tier.key} label={tier.name}>
            {formatPrice(Number(tier.price))} · {TIER_TYPE_LABELS[tier.tier_type]}
            <span className="block text-text-primary/70">
              {formatNumber(Number(tier.quota))} per session, up to {tier.max_per_transaction} per order
            </span>
          </Row>
        ))}
        <Row label="Seat map">
          {seatMap ? (
            <SeatMapPreview src={seatMap.previewUrl} eventTitle={basics.title} description={seatMap.file.name} className="bg-bg-surface-2" />
          ) : (
            "None. Buyers will only see the tier list."
          )}
        </Row>
      </ReviewSection>

      <div className="space-y-1 rounded-[20px] border border-text-primary/15 p-6 text-sm sm:p-8">
        <p className="font-semibold">What happens next</p>
        <p className="text-text-primary/70">
          Our team checks the event and its permit. Once approved, the event goes live automatically. After it is live, only the banner and the description can be changed.
        </p>
      </div>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-[20px] bg-bg-surface p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" hoverScale={1} onClick={onEdit} className="rounded-full">
          <Pencil aria-hidden="true" />
          Edit
        </Button>
      </div>
      <dl className="divide-y divide-text-primary/10">{children}</dl>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 text-sm first:pt-0 last:pb-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-text-primary/70">{label}</dt>
      <dd className="text-text-primary">{children}</dd>
    </div>
  );
}
