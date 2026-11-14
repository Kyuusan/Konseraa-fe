import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TicketTier } from "@/types/event";
import { QuantityStepper } from "../shared/quantityStepper";

const TIER_TYPE_LABELS: Record<TicketTier["tier_type"], string> = {
  early_bird: "Early bird",
  regular: "Regular",
  vip: "VIP",
  vvip: "VVIP",
  group_package: "Group package",
};

/** Below this, the remaining quota is shown so buyers know it is running out. */
const LOW_QUOTA = 50;

interface TierCardProps {
  tier: TicketTier;
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

export function TierCard({ tier, quantity, max, onChange }: TierCardProps) {
  const soldOut = tier.available_quota === 0;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-[20px] border bg-bg-surface p-5 transition-colors",
        quantity > 0 ? "border-accent-lime" : "border-transparent",
        soldOut && "opacity-60",
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-semibold tracking-widest text-text-muted uppercase">{TIER_TYPE_LABELS[tier.tier_type]}</p>
        <p className="font-heading text-xl font-semibold">{tier.name}</p>
        <p className="text-sm text-text-muted">
          {soldOut
            ? "Sold out"
            : `Up to ${tier.max_per_transaction} per order${tier.available_quota <= LOW_QUOTA ? ` · ${tier.available_quota} left` : ""}`}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <p className="font-heading text-xl font-semibold">{formatPrice(tier.price)}</p>
        {!soldOut && <QuantityStepper value={quantity} max={max} onChange={onChange} label={tier.name} />}
      </div>
    </li>
  );
}
