import { z } from "zod";

// Shapes follow openapi-spec.yaml. Fields marked "not in spec" are needed by the
// PRD checkout/payment screens (§13.4–13.5); confirm with backend.

const IsoDateTime = z.iso.datetime({ offset: true });

/** Not in spec (GET /carts has no schema): mirrors the carts table and its held_until. */
export const CartItemSchema = z.object({
  id: z.uuid(),
  ticket_tier_id: z.uuid(),
  event_session_id: z.uuid(),
  quantity: z.int().positive(),
  unit_price: z.number().nonnegative(),
  line_total: z.number().nonnegative(),
  held_until: IsoDateTime,
});
export type CartItem = z.infer<typeof CartItemSchema>;

/** Body of POST /carts (seat_id left out: the seat map is not built yet). */
export const AddCartItemSchema = CartItemSchema.pick({
  ticket_tier_id: true,
  event_session_id: true,
  quantity: true,
});
export type AddCartItem = z.infer<typeof AddCartItemSchema>;

export const BOOKING_STATUSES = [
  "pending",
  "awaiting_payment",
  "paid",
  "expired",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BookingItemSchema = z.object({
  id: z.uuid(),
  ticket_tier_id: z.uuid(),
  quantity: z.int().positive(),
  unit_price: z.number().nonnegative(),
  line_total: z.number().nonnegative(),
});
export type BookingItem = z.infer<typeof BookingItemSchema>;

export const BookingSchema = z.object({
  id: z.uuid(),
  booking_code: z.string(),
  status: z.enum(BOOKING_STATUSES),
  subtotal_amount: z.number().nonnegative(),
  discount_amount: z.number().nonnegative(),
  platform_fee_amount: z.number().nonnegative(),
  total_amount: z.number().nonnegative(),
  hold_expires_at: IsoDateTime,
  items: z.array(BookingItemSchema),
});
export type Booking = z.infer<typeof BookingSchema>;

export const PAYMENT_METHOD_CATEGORIES = [
  "virtual_account",
  "ewallet",
  "credit_card",
  "qris",
  "paylater",
] as const;
export type PaymentMethodCategory = (typeof PAYMENT_METHOD_CATEGORIES)[number];

/** Not in spec: mirrors the payment_methods table used by POST /bookings/{id}/pay. */
export const PaymentMethodSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  category: z.enum(PAYMENT_METHOD_CATEGORIES),
});
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "success",
  "failed",
  "expired",
  "refunded",
  "partially_refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PaymentSchema = z.object({
  id: z.uuid(),
  booking_id: z.uuid(),
  amount: z.number().nonnegative(),
  status: z.enum(PAYMENT_STATUSES),
  payment_url: z.url(),
  expires_at: IsoDateTime,
  /** Not in spec: PRD §5.4 says pay returns "payment_url / VA number / QRIS code". */
  va_number: z.string().nullable(),
  qr_string: z.string().nullable(),
});
export type Payment = z.infer<typeof PaymentSchema>;
