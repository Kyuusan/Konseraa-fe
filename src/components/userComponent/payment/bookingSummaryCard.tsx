import { formatDate, formatTime } from "@/lib/format";
import type { Booking } from "@/types/booking";
import type { ConcertEvent, EventSession, TicketTier } from "@/types/event";
import { CostSummary } from "../checkout/costSummary";
import { OrderItems } from "../checkout/orderItems";
import { Perforation } from "../shared/perforation";
import { TicketCard } from "../shared/ticketCard";

interface BookingSummaryCardProps {
  event: ConcertEvent;
  session: EventSession;
  tiers: TicketTier[];
  booking: Booking;
  promoCode?: string;
}

export function BookingSummaryCard({ event, session, tiers, booking, promoCode }: BookingSummaryCardProps) {
  const timeZone = event.venue.timezone;

  return (
    <TicketCard>
      <div className="space-y-1 p-5">
        <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">Booking {booking.booking_code}</p>
        <p className="font-heading text-lg leading-tight font-semibold">{event.title}</p>
        <p className="text-sm text-text-muted">
          {session.name} · {formatDate(session.start_at, timeZone)} · {formatTime(session.start_at, timeZone)}
        </p>
        <p className="text-sm text-text-muted">{event.venue.name}, {event.venue.city}</p>
      </div>
      <Perforation />
      <div className="space-y-5 p-5">
        <OrderItems items={booking.items} tiers={tiers} />
        <CostSummary booking={booking} promoCode={promoCode} />
      </div>
    </TicketCard>
  );
}
