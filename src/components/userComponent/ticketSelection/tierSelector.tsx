"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { holdExpiry } from "@/__fixtures__/checkout";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { MAX_TICKETS_PER_TRANSACTION } from "@/lib/constants";
import type { TicketTier } from "@/types/event";
import { cn } from "@/lib/utils";
import { toCheckoutQuery } from "../checkout/checkoutParams";
import { TierCard } from "./tierCard";

interface TierSelectorProps {
  eventSlug: string;
  sessionId: string;
  tiers: TicketTier[];
  /** Shown above the tiers, so buyers can match tiers to areas. */
  seatMap?: ReactNode;
}

export function TierSelector({ eventSlug, sessionId, tiers, seatMap }: TierSelectorProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const total = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const remaining = MAX_TICKETS_PER_TRANSACTION - total;

  function holdTickets() {
    const items = tiers
      .filter((tier) => (quantities[tier.id] ?? 0) > 0)
      .map((tier) => ({ ticket_tier_id: tier.id, event_session_id: sessionId, quantity: quantities[tier.id] ?? 0 }));
    // Stands in for the held_until returned by POST /carts.
    const heldUntil = holdExpiry(new Date());
    router.push(`/checkout?${toCheckoutQuery({ eventSlug, sessionId, items, heldUntil })}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      {/* With a seat map, map and tiers sit side by side (stacked on smaller screens). */}
      <div className={cn("min-w-0", seatMap ? "grid gap-6 xl:grid-cols-2 xl:items-start" : undefined)}>
        {seatMap && <div className="min-w-0 xl:sticky xl:top-28">{seatMap}</div>}
        <ul className="min-w-0 space-y-3">
          {tiers.map((tier) => {
            const quantity = quantities[tier.id] ?? 0;
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                quantity={quantity}
                max={Math.min(tier.max_per_transaction, tier.available_quota, quantity + remaining)}
                onChange={(value) => setQuantities((current) => ({ ...current, [tier.id]: value }))}
              />
            );
          })}
        </ul>
      </div>

      <aside aria-label="Your selection">
        <div className="space-y-4 rounded-[20px] bg-bg-surface p-5 lg:sticky lg:top-28">
          <div>
            <p className="font-heading text-3xl font-bold">
              {total} {total === 1 ? "ticket" : "tickets"}
            </p>
            <p className="text-sm text-text-muted">
              Up to {MAX_TICKETS_PER_TRANSACTION} tickets per transaction.
              {total > 0 && remaining === 0 && " You've reached the limit."}
            </p>
          </div>
          <p className="text-sm text-text-muted">
            Your tickets are held for a few minutes after you continue, so you can finish checkout.
          </p>
          <Button
            onClick={holdTickets}
            disabled={total === 0}
            hoverScale={1.02}
            className="h-12 w-full rounded-full text-base font-semibold"
          >
            Hold tickets
          </Button>
        </div>
      </aside>
    </div>
  );
}
