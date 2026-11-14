// Dummy stand-ins for what the backend computes: holds (POST /carts), booking
// totals (POST /bookings) and payment details (POST /bookings/{id}/pay).
// The frontend never does this maths itself (rules §4.4); remove when wired up.
import {
  BookingSchema,
  CartItemSchema,
  PaymentMethodSchema,
  PaymentSchema,
  type AddCartItem,
  type Booking,
  type CartItem,
  type PaymentMethod,
} from "@/types/booking";
import type { TicketTier } from "@/types/event";
import { fixtureId } from "./ids";

/** PRD §9.1: holds last 10 minutes; the real value comes from server config. */
const HOLD_MINUTES = 10;
/** Stands in for commission_settings. */
const PLATFORM_FEE_RATE = 0.05;
/** PRD §9.2 sets 24h for virtual accounts and 15 min for e-wallets; the rest are assumed 15 min. */
const PAYMENT_WINDOW_MINUTES = { virtual_account: 24 * 60, ewallet: 15, credit_card: 15, qris: 15, paylater: 15 };

const PROMOS: Record<string, { type: "percentage" | "fixed"; value: number }> = {
  KONSERA10: { type: "percentage", value: 10 },
  WELCOME5: { type: "fixed", value: 5 },
};

export const PAYMENT_METHODS: PaymentMethod[] = PaymentMethodSchema.array().parse([
  { id: fixtureId(601), code: "bca_va", name: "BCA Virtual Account", category: "virtual_account" },
  { id: fixtureId(602), code: "mandiri_va", name: "Mandiri Virtual Account", category: "virtual_account" },
  { id: fixtureId(603), code: "gopay", name: "GoPay", category: "ewallet" },
  { id: fixtureId(604), code: "ovo", name: "OVO", category: "ewallet" },
  { id: fixtureId(605), code: "card", name: "Credit / debit card", category: "credit_card" },
  { id: fixtureId(606), code: "qris", name: "QRIS", category: "qris" },
  { id: fixtureId(607), code: "kredivo", name: "Kredivo", category: "paylater" },
]);

const cents = (amount: number) => Math.round(amount * 100) / 100;
const addMinutes = (iso: string, minutes: number) => new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();

/** What POST /carts would return as held_until for a hold placed at `placedAt`. */
export const holdExpiry = (placedAt: Date) => addMinutes(placedAt.toISOString(), HOLD_MINUTES);

export function holdCartItems(items: AddCartItem[], tiers: TicketTier[], heldUntil: string): CartItem[] {
  return CartItemSchema.array().parse(
    items.flatMap(({ ticket_tier_id, event_session_id, quantity }, index) => {
      const tier = tiers.find((item) => item.id === ticket_tier_id);
      if (!tier) return [];
      return [{
        id: fixtureId(700 + index),
        ticket_tier_id: tier.id,
        event_session_id,
        quantity,
        unit_price: tier.price,
        line_total: cents(tier.price * quantity),
        held_until: heldUntil,
      }];
    }),
  );
}

export function previewBooking(items: CartItem[], promoCode: string | undefined) {
  const subtotal = cents(items.reduce((sum, item) => sum + item.line_total, 0));
  const promo = promoCode ? PROMOS[promoCode.toUpperCase()] : undefined;
  const discount = !promo ? 0 : promo.type === "percentage" ? cents(subtotal * (promo.value / 100)) : Math.min(promo.value, subtotal);
  const platformFee = cents((subtotal - discount) * PLATFORM_FEE_RATE);
  const heldUntil = items[0]?.held_until ?? new Date(0).toISOString();
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const booking: Booking = BookingSchema.parse({
    id: fixtureId(800),
    booking_code: `KNS-${heldUntil.slice(2, 10).replaceAll("-", "")}-${String(quantity * 137 + subtotal).replace(".", "").slice(0, 4)}`,
    status: "awaiting_payment",
    subtotal_amount: subtotal,
    discount_amount: discount,
    platform_fee_amount: platformFee,
    total_amount: cents(subtotal - discount + platformFee),
    hold_expires_at: heldUntil,
    items: items.map((item, index) => ({
      id: fixtureId(900 + index),
      ticket_tier_id: item.ticket_tier_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total,
    })),
  });

  return { booking, promoError: promoCode && !promo ? "This promo code is not valid." : null };
}

export function createPayment(booking: Booking, method: PaymentMethod, startedAt: string) {
  return PaymentSchema.parse({
    id: fixtureId(1000),
    booking_id: booking.id,
    amount: booking.total_amount,
    status: "pending",
    payment_url: `https://pay.example.com/${booking.booking_code}`,
    expires_at: addMinutes(startedAt, PAYMENT_WINDOW_MINUTES[method.category]),
    va_number: method.category === "virtual_account" ? `8808${booking.booking_code.replace(/\D/g, "").padEnd(12, "0")}` : null,
    qr_string: method.category === "qris" ? `00020101021226KONSERA${booking.booking_code}` : null,
  });
}
