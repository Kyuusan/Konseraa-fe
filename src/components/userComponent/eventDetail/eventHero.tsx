import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/format";
import type { ConcertEvent } from "@/types/event";
import { StatusBadge } from "../shared/statusBadge";

const mapsUrl = (event: ConcertEvent) =>
  `https://www.google.com/maps/search/?api=1&query=${event.venue.latitude},${event.venue.longitude}`;

export function EventHero({ event }: { event: ConcertEvent }) {
  return (
    <header className="space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-[20px] bg-bg-surface sm:aspect-21/9">
        <Image src={event.banner_url} alt="" fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {event.status !== "published" && <StatusBadge status={event.status} />}
          {event.categories.map((genre) => (
            <Badge key={genre} variant="outline" className="rounded-full">{genre}</Badge>
          ))}
        </div>
        <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">{event.title}</h1>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Date</dt>
            <dd className="mt-1">
              {formatDate(event.starts_at, event.venue.timezone)} · {formatTime(event.starts_at, event.venue.timezone)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Venue</dt>
            <dd className="mt-1">
              {event.venue.name}, {event.venue.city}{" "}
              <a
                href={mapsUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium whitespace-nowrap text-accent-lime underline-offset-4 hover:underline"
              >
                View on Maps
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
