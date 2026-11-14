import { formatPrice } from "@/lib/format";
import type { BookingItem } from "@/types/booking";
import type { TicketTier } from "@/types/event";

interface OrderItemsProps {
  items: Pick<BookingItem, "ticket_tier_id" | "quantity" | "unit_price" | "line_total">[];
  tiers: TicketTier[];
}

export function OrderItems({ items, tiers }: OrderItemsProps) {
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li key={item.ticket_tier_id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <div>
            <p className="font-semibold">{tiers.find((tier) => tier.id === item.ticket_tier_id)?.name ?? "Ticket"}</p>
            <p className="text-sm text-text-muted">
              {item.quantity} × {formatPrice(item.unit_price)}
            </p>
          </div>
          <p className="font-semibold">{formatPrice(item.line_total)}</p>
        </li>
      ))}
    </ul>
  );
}
