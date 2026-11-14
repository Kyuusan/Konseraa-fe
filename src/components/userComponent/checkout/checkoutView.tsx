"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { previewBooking } from "@/__fixtures__/checkout";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useRemaining } from "@/hooks/use-now";
import { formatDate, formatPrice, formatTime } from "@/lib/format";
import type { CartItem, PaymentMethod } from "@/types/booking";
import type { ConcertEvent, EventSession, TicketTier } from "@/types/event";
import { Countdown } from "../shared/countdown";
import { EmptyState } from "../shared/emptyState";
import { Perforation } from "../shared/perforation";
import { TicketCard } from "../shared/ticketCard";
import { type CheckoutSelection, toCheckoutQuery } from "./checkoutParams";
import { CostSummary } from "./costSummary";
import { OrderItems } from "./orderItems";
import { PaymentMethodPicker } from "./paymentMethodPicker";
import { PromoCodeField } from "./promoCodeField";

interface CheckoutViewProps {
  event: ConcertEvent;
  session: EventSession;
  tiers: TicketTier[];
  cartItems: CartItem[];
  paymentMethods: PaymentMethod[];
  selection: CheckoutSelection;
}

export function CheckoutView({ event, session, tiers, cartItems, paymentMethods, selection }: CheckoutViewProps) {
  const router = useRouter();
  const [promo, setPromo] = useState<string | undefined>();
  const [method, setMethod] = useState("");
  const remaining = useRemaining(selection.heldUntil);
  // Stands in for POST /bookings, which returns the server-calculated totals.
  const { booking, promoError } = previewBooking(cartItems, promo);
  const timeZone = event.venue.timezone;

  if (remaining === 0) {
    return (
      <EmptyState
        title="Your hold has expired"
        description="The tickets were released so other fans can buy them. Pick your tickets again to continue."
        action={
          <Button asChild hoverScale={1} className="rounded-full">
            <Link href={`/events/${event.slug}/tickets?session=${session.id}`}>Choose tickets again</Link>
          </Button>
        }
      />
    );
  }

  function pay() {
    const extra: Record<string, string> = { method, started_at: new Date().toISOString() };
    if (promo && !promoError) extra.promo = promo;
    router.push(`/payment/${booking.booking_code}?${toCheckoutQuery(selection, extra)}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-8">
        <p className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-bg-surface px-5 py-4 text-sm">
          <span className="text-text-muted">Your tickets are held for</span>
          <Countdown until={selection.heldUntil} />
        </p>

        <section aria-labelledby="items-heading" className="space-y-4">
          <h2 id="items-heading" className="font-heading text-xl font-semibold">Tickets</h2>
          <div className="rounded-[20px] bg-bg-surface p-5">
            <OrderItems items={cartItems} tiers={tiers} />
          </div>
        </section>

        <section aria-labelledby="payment-heading" className="space-y-4">
          <h2 id="payment-heading" className="font-heading text-xl font-semibold">Payment method</h2>
          <PaymentMethodPicker methods={paymentMethods} value={method} onChange={setMethod} />
        </section>
      </div>

      <aside aria-label="Order summary">
        <TicketCard className="lg:sticky lg:top-28">
          <div className="space-y-1 p-5">
            <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">Order summary</p>
            <p className="font-heading text-lg leading-tight font-semibold">{event.title}</p>
            <p className="text-sm text-text-muted">
              {session.name} · {formatDate(session.start_at, timeZone)} · {formatTime(session.start_at, timeZone)}
            </p>
          </div>
          <Perforation />
          <div className="space-y-5 p-5">
            <PromoCodeField applied={promoError ? undefined : promo} error={promoError} onApply={setPromo} />
            <CostSummary booking={booking} promoCode={promoError ? undefined : promo} />
            <Button
              onClick={pay}
              disabled={method === ""}
              hoverScale={1.02}
              className="h-12 w-full rounded-full text-base font-semibold"
            >
              {method === "" ? "Choose a payment method" : `Pay ${formatPrice(booking.total_amount)}`}
            </Button>
          </div>
        </TicketCard>
      </aside>
    </div>
  );
}
