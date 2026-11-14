import Link from "next/link";
import { formatDate, formatTime } from "@/lib/format";
import type { Ticket } from "@/types/ticket";
import { StatusBadge } from "../shared/statusBadge";
import { TicketCard } from "../shared/ticketCard";

export function TicketListItem({ ticket }: { ticket: Ticket }) {
  const timeZone = ticket.venue_timezone;

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group block rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
    >
      <TicketCard className="flex flex-wrap items-center justify-between gap-4 p-5 transition-colors group-hover:bg-bg-surface-2">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">
            {formatDate(ticket.session_start_at, timeZone)} · {formatTime(ticket.session_start_at, timeZone)}
          </p>
          <p className="font-heading text-xl leading-tight font-semibold">{ticket.event_title}</p>
          <p className="text-sm text-text-muted">
            {ticket.session_name} · {ticket.tier_name} · {ticket.venue_name}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </TicketCard>
    </Link>
  );
}
