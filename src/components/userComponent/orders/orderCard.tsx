"use client";

import Image from "next/image";
import { useState } from "react";
import { useRemaining } from "@/hooks/use-now";
import { UNPAID_ORDER_EXPIRY_MINUTES } from "@/lib/constants";
import { formatDate, formatDateTime, formatPrice, formatTime } from "@/lib/format";
import type { UserOrder } from "@/types/booking";
import { ButtonLink } from "../shared/buttonLink";
import { Countdown } from "../shared/countdown";
import { StatusBadge } from "../shared/statusBadge";
import { TicketCard } from "../shared/ticketCard";
import { CancelOrderDialog } from "./cancelOrderDialog";

interface OrderCardProps {
  order: UserOrder;
  /** Payment page URL for an order that is still open. */
  resumeHref: string | null;
}

const ordered = (order: UserOrder) =>
  formatDateTime(order.created_at, order.venue_timezone, { day: "numeric", month: "short", year: "numeric" });

export function OrderCard({ order: initial, resumeHref }: OrderCardProps) {
  // A cancel lasts until reload; the API would return the order as "cancelled".
  const [cancelled, setCancelled] = useState(false);
  // Unpaid orders expire on their own after the hour (agreed rule); the server does the same.
  const remaining = useRemaining(initial.payment_expires_at ?? initial.created_at);
  const timedOut = initial.status === "awaiting_payment" && initial.payment_expires_at !== null && remaining === 0;
  const order: UserOrder = cancelled
    ? { ...initial, status: "cancelled", payment_expires_at: null }
    : timedOut
      ? { ...initial, status: "expired", payment_expires_at: null }
      : initial;
  const timeZone = order.venue_timezone;
  const open = order.status === "awaiting_payment" && resumeHref;
  const refund = order.refund;
  const refundPending = refund?.request?.status === "requested";

  return (
    <TicketCard className="grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <Image src={order.poster_url} alt="" width={64} height={80} className="hidden h-20 w-16 rounded-xl object-cover sm:block" />

      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <span className="font-mono text-xs text-text-primary/70">{order.booking_code}</span>
        </div>
        <p className="truncate font-heading text-xl font-semibold">{order.event_title}</p>
        <p className="text-sm text-text-primary/70">
          {order.session_name} · {formatDate(order.session_start_at, timeZone)} · {formatTime(order.session_start_at, timeZone)}
        </p>
        <p className="text-sm text-text-primary/70">
          {order.ticket_count} {order.ticket_count === 1 ? "ticket" : "tickets"} · ordered {ordered(order)}
          {order.payment_method_name && ` · ${order.payment_method_name}`}
        </p>
        {refundPending && refund?.request && (
          <p className="text-sm text-accent-pink">
            Refund requested {formatDate(refund.request.requested_at, timeZone)}. Waiting for the organizer; your tickets are on hold.
          </p>
        )}
        {refund?.request?.status === "rejected" && (
          <p className="text-sm text-danger">Refund declined: {refund.request.rejection_reason}</p>
        )}
        {refund?.eligible && refund.deadline && (
          <p className="text-xs text-text-primary/70">Refundable until {formatDate(refund.deadline, timeZone)}</p>
        )}
        {refund?.blocked_reason && <p className="text-xs text-text-primary/70">{refund.blocked_reason}</p>}
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <div className="sm:text-right">
          <p className="font-heading text-2xl font-bold">{formatPrice(order.total_amount)}</p>
          {order.status === "refunded" && order.refunded_amount !== null && (
            <p className="text-xs text-text-primary/70">{formatPrice(order.refunded_amount)} refunded</p>
          )}
          {open && order.payment_expires_at && (
            <p className="text-xs text-warning">
              Pay within <Countdown until={order.payment_expires_at} />
            </p>
          )}
          {open && (
            <p className="text-xs text-text-primary/60">Expires automatically if unpaid after {UNPAID_ORDER_EXPIRY_MINUTES / 60} hour</p>
          )}
        </div>
        {open ? (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <CancelOrderDialog bookingCode={order.booking_code} onCancelled={() => setCancelled(true)} triggerClassName="h-10 px-4" />
            <ButtonLink href={resumeHref} hoverScale={1.02} className="h-10 rounded-full px-5 font-semibold">
              Continue payment
            </ButtonLink>
          </div>
        ) : order.status === "paid" && !refundPending ? (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {refund?.eligible && (
              <ButtonLink href={`/orders/${order.booking_code}/refund`} variant="ghost" className="h-10 rounded-full px-4">
                Request refund
              </ButtonLink>
            )}
            <ButtonLink href="/tickets" variant="outline" className="h-10 rounded-full px-5">
              View tickets
            </ButtonLink>
          </div>
        ) : order.status === "expired" || order.status === "cancelled" ? (
          <ButtonLink href={`/events/${order.event_slug}`} variant="outline" className="h-10 rounded-full px-5">
            Buy again
          </ButtonLink>
        ) : null}
      </div>
    </TicketCard>
  );
}
