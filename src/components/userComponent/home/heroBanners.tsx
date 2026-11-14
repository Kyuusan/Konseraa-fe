import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConcertEvent } from "@/types/event";

// Static, hand-picked home banners (one large, two small), like a storefront header.

function EventBanner({ event, size, label }: { event: ConcertEvent; size: "large" | "small"; label: string }) {
  const large = size === "large";

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-[20px] bg-bg-surface outline-none focus-visible:ring-2 focus-visible:ring-accent-pink",
        large ? "aspect-4/5 sm:aspect-video lg:row-span-2 lg:aspect-auto" : "aspect-video lg:aspect-auto",
      )}
    >
      <Image
        src={event.banner_url}
        alt=""
        fill
        priority={large}
        sizes={large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {/* Solid panel (no gradient) keeps the copy readable over any photo. */}
      <div
        className={cn(
          "absolute rounded-2xl bg-bg-base/80 backdrop-blur-sm",
          large ? "inset-x-3 bottom-3 space-y-3 p-5 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:p-6" : "inset-x-3 bottom-3 p-4",
        )}
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">{label}</p>
          <p className={cn("font-heading leading-tight font-bold", large ? "text-3xl sm:text-4xl" : "text-lg")}>{event.title}</p>
          <p className="text-sm text-text-muted">
            {formatDate(event.starts_at, event.venue.timezone)} · {event.venue.city}
          </p>
        </div>
        {/* A visual label only: the whole banner is already the link. */}
        {large && (
          <span className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
            Get tickets
          </span>
        )}
      </div>
    </Link>
  );
}

function PromoBanner() {
  return (
    <Link
      href="/events"
      className="flex flex-col justify-between gap-6 rounded-[20px] bg-accent-lime p-6 text-bg-base outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
    >
      <p className="text-xs font-semibold tracking-widest uppercase">First order</p>
      <div className="space-y-2">
        <p className="font-heading text-3xl leading-tight font-bold">10% off your first tickets</p>
        <p className="text-sm">
          Use code <span className="rounded-md bg-bg-base px-2 py-0.5 font-semibold text-accent-lime">KONSERA10</span> at checkout.
        </p>
      </div>
    </Link>
  );
}

export function HeroBanners({ main, secondary }: { main: ConcertEvent; secondary: ConcertEvent }) {
  return (
    <section aria-label="Highlights" className="grid gap-4 lg:h-136 lg:grid-cols-3 lg:grid-rows-2">
      <div className="lg:col-span-2 lg:row-span-2 lg:grid">
        <EventBanner event={main} size="large" label="Featured" />
      </div>
      <PromoBanner />
      <EventBanner event={secondary} size="small" label="Don't miss" />
    </section>
  );
}
