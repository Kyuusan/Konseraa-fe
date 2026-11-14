"use client";

import QRCode from "react-qr-code";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Progress } from "@/components/animate-ui/components/radix/progress";
import { useNow } from "@/hooks/use-now";
import { QR_REFRESH_SECONDS, TRANSFER_LOCK_HOURS } from "@/lib/constants";
import { formatDate, formatDateTime, formatTime } from "@/lib/format";
import type { Ticket } from "@/types/ticket";
import { Perforation } from "../shared/perforation";
import { StatusBadge } from "../shared/statusBadge";
import { TicketCard } from "../shared/ticketCard";

const HOUR_MS = 60 * 60 * 1000;

function Watermark({ text }: { text: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <div className="absolute -inset-1/2 flex -rotate-12 flex-col justify-center gap-6">
        {Array.from({ length: 14 }, (_, row) => (
          <p key={row} className="text-xs font-semibold whitespace-nowrap text-text-primary/6">
            {Array.from({ length: 6 }, () => text).join("   ·   ")}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ETicketView({ ticket, qrToken }: { ticket: Ticket; qrToken: string }) {
  const now = useNow();
  const timeZone = ticket.venue_timezone;
  const usable = ticket.status === "issued";
  const elapsed = now === null ? 0 : Math.floor(now / 1000) % QR_REFRESH_SECONDS;
  const transferLocked =
    now !== null && new Date(ticket.session_start_at).getTime() - now < TRANSFER_LOCK_HOURS * HOUR_MS;

  return (
    <TicketCard className="mx-auto max-w-md">
      <div className="space-y-1 p-6">
        <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">
          {formatDate(ticket.session_start_at, timeZone)} · {formatTime(ticket.session_start_at, timeZone)}
        </p>
        <h2 className="font-heading text-2xl leading-tight font-bold">{ticket.event_title}</h2>
        <p className="text-sm text-text-muted">
          {ticket.session_name} · {ticket.venue_name}
        </p>
      </div>

      <Perforation />

      <div className="relative p-6">
        {/* Watermark sits behind the QR box, never on top of it (rules §9.6). */}
        {now !== null && <Watermark text={`${ticket.holder_name} · ${formatDateTime(new Date(now).toISOString(), timeZone)}`} />}
        {usable ? (
          <div className="relative flex flex-col items-center gap-4">
            <div className="rounded-2xl bg-text-primary p-5 text-bg-base">
              <QRCode value={qrToken} size={220} fgColor="currentColor" bgColor="transparent" />
            </div>
            <div className="w-full max-w-60 space-y-2 text-center">
              <Progress value={(elapsed / QR_REFRESH_SECONDS) * 100} className="h-1" />
              <p className="text-xs text-text-muted" aria-live="off">
                Code refreshes in {QR_REFRESH_SECONDS - elapsed}s · screenshots won&apos;t work at the gate
              </p>
            </div>
          </div>
        ) : (
          <p className="relative py-10 text-center text-sm text-text-muted">
            {ticket.status === "checked_in" ? "This ticket has been used to enter." : "This ticket can no longer be used."}
          </p>
        )}
      </div>

      <Perforation />

      <dl className="grid grid-cols-2 gap-4 p-6 text-sm">
        <div>
          <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Tier</dt>
          <dd className="mt-1 font-semibold">{ticket.tier_name}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Seat</dt>
          <dd className="mt-1 font-semibold">{ticket.seat_label ?? "General admission"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Ticket code</dt>
          <dd className="mt-1 font-semibold tabular-nums">{ticket.ticket_code}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-widest text-text-muted uppercase">Status</dt>
          <dd className="mt-1">
            <StatusBadge status={ticket.status} />
          </dd>
        </div>
      </dl>

      {usable && (
        <div className="space-y-2 px-6 pb-6">
          <Button variant="outline" disabled className="h-11 w-full rounded-full">
            Transfer ticket
          </Button>
          <p className="text-center text-xs text-text-muted">
            {transferLocked
              ? `Transfers are locked from ${TRANSFER_LOCK_HOURS} hours before the show.`
              : "Ticket transfer becomes available once the backend is connected."}
          </p>
        </div>
      )}
    </TicketCard>
  );
}
