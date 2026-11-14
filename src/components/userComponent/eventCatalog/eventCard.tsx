import Image from "next/image";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConcertEvent } from "@/types/event";
import { Perforation } from "../shared/perforation";
import { TicketCard } from "../shared/ticketCard";

interface EventCardProps {
  event: ConcertEvent;
  className?: string;
  priority?: boolean;
}

export function EventCard({ event, className, priority = false }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group block rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-accent-pink",
        className,
      )}
    >
      <TicketCard className="flex h-full flex-col transition-colors duration-200 group-hover:bg-bg-surface-2">
        <div className="relative aspect-4/5 overflow-hidden">
          <Image
            src={event.poster_url}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <Perforation className="mt-3 sm:mt-4" />
        <div className="flex flex-1 flex-col gap-1 p-3 pt-3 sm:p-5 sm:pt-4">
          <p className="truncate text-[11px] font-semibold tracking-wider text-text-muted uppercase sm:text-xs sm:tracking-widest">
            {formatDate(event.starts_at, event.venue.timezone)}
          </p>
          <h3 className="line-clamp-2 font-heading text-base leading-tight font-semibold sm:text-lg">{event.title}</h3>
          <p className="truncate text-xs text-text-muted sm:text-sm">
            {event.venue.name} · {event.venue.city}
          </p>
          <p className="mt-auto pt-2 text-xs text-text-muted sm:pt-3 sm:text-sm">
            From <span className="font-semibold text-text-primary">{formatPrice(event.min_price)}</span>
          </p>
        </div>
      </TicketCard>
    </Link>
  );
}
