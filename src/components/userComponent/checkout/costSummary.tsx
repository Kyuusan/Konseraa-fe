import { formatPrice } from "@/lib/format";
import type { Booking } from "@/types/booking";

// Every figure comes from the backend booking; nothing is recalculated here.
export function CostSummary({ booking, promoCode }: { booking: Booking; promoCode?: string }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-text-muted">Subtotal</dt>
        <dd>{formatPrice(booking.subtotal_amount)}</dd>
      </div>
      {booking.discount_amount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Discount{promoCode && ` (${promoCode.toUpperCase()})`}</dt>
          <dd className="text-accent-lime">−{formatPrice(booking.discount_amount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-text-muted">Platform fee</dt>
        <dd>{formatPrice(booking.platform_fee_amount)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
        <dt className="font-semibold">Total</dt>
        <dd className="font-heading text-2xl font-bold">{formatPrice(booking.total_amount)}</dd>
      </div>
    </dl>
  );
}
