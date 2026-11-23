import Image from "next/image";
import Link from "next/link";
import { formatDate, formatNumber, formatTime } from "@/lib/format";
import type { OrganizerEvent } from "@/types/organizer";
import { ProgressRing } from "../shared/progressRing";

export function NextShowCard({ event }: { event: OrganizerEvent | undefined }) {
  if (!event) {
    return (
      <section className="rounded-[20px] bg-bg-surface p-6 text-sm text-text-primary/70">
        No upcoming shows. Create an event to start selling.
      </section>
    );
  }

  const percent = Math.round((event.tickets_sold / event.ticket_capacity) * 100);
  const timeZone = event.venue.timezone;

  return (
    <section aria-labelledby="next-show-heading" className="overflow-hidden rounded-[20px] bg-bg-surface">
      <Link href={`/organizer/events/${event.slug}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-accent-pink">
        <div className="relative aspect-video overflow-hidden">
          <Image src={event.banner_url} alt="" fill sizes="(min-width: 1280px) 30vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" />
          <p id="next-show-heading" className="absolute top-3 left-3 rounded-full bg-bg-base/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            Next show
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-heading text-xl font-bold">{event.title}</p>
            <p className="text-sm text-text-primary/70">
              {formatDate(event.starts_at, timeZone)} · {formatTime(event.starts_at, timeZone)}
            </p>
            <p className="text-sm text-text-primary/70">
              {formatNumber(event.tickets_sold)} of {formatNumber(event.ticket_capacity)} sold
            </p>
          </div>
          <ProgressRing percent={percent} label="sold" size={96} />
        </div>
      </Link>
    </section>
  );
}
