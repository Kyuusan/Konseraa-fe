import { formatNumber, formatPrice } from "@/lib/format";
import type { OrganizerEvent } from "@/types/organizer";
import { SalesProgress } from "../shared/salesProgress";

export function EventStats({ event }: { event: OrganizerEvent }) {
  const average = event.tickets_sold > 0 ? event.gross_revenue / event.tickets_sold : 0;

  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-[20px] bg-bg-surface p-5">
        <dt className="text-sm font-semibold">Tickets sold</dt>
        <dd className="mt-3 font-heading text-2xl font-bold xl:text-3xl">{formatNumber(event.tickets_sold)}</dd>
        <dd className="mt-3">
          <SalesProgress sold={event.tickets_sold} capacity={event.ticket_capacity} />
        </dd>
      </div>
      <div className="rounded-[20px] bg-bg-surface p-5">
        <dt className="text-sm font-semibold">Gross sales</dt>
        <dd className="mt-3 font-heading text-2xl font-bold xl:text-3xl">{formatPrice(event.gross_revenue)}</dd>
        <dd className="mt-1 text-xs text-text-primary/70">Before platform fees</dd>
      </div>
      <div className="rounded-[20px] bg-bg-surface p-5">
        <dt className="text-sm font-semibold">Average per ticket</dt>
        <dd className="mt-3 font-heading text-2xl font-bold xl:text-3xl">{formatPrice(average)}</dd>
        <dd className="mt-1 text-xs text-text-primary/70">
          Prices from {formatPrice(event.min_price)} to {formatPrice(event.max_price)}
        </dd>
      </div>
    </dl>
  );
}
