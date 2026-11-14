import { createPayment, holdCartItems, PAYMENT_METHODS, previewBooking } from "@/__fixtures__/checkout";
import { getEventBySlug, getEventSessions, getEventTicketTiers } from "@/__fixtures__/events";
import { param, parseCheckoutSelection, toCheckoutQuery } from "../checkout/checkoutParams";

type SearchParams = Record<string, string | string[] | undefined>;

// Rebuilds the booking + payment that GET /bookings/{id} and /payment-status would
// return, from the hold carried in the URL. Null means "booking not found".
export function loadPayment(bookingCode: string, searchParams: SearchParams) {
  const selection = parseCheckoutSelection(searchParams);
  const method = PAYMENT_METHODS.find((item) => item.code === param(searchParams, "method"));
  const startedAt = param(searchParams, "started_at");
  const promo = param(searchParams, "promo");
  if (!selection || !method || !startedAt || Number.isNaN(Date.parse(startedAt))) return null;

  const event = getEventBySlug(selection.eventSlug);
  const session = event && getEventSessions(event.id).find((item) => item.id === selection.sessionId);
  if (!event || !session) return null;

  const tiers = getEventTicketTiers(event.id);
  const { booking } = previewBooking(holdCartItems(selection.items, tiers, selection.heldUntil), promo);
  if (booking.booking_code !== bookingCode) return null;

  const extra: Record<string, string> = { method: method.code, started_at: startedAt };
  if (promo) extra.promo = promo;

  return {
    event,
    session,
    tiers,
    booking,
    method,
    promo,
    payment: createPayment(booking, method, startedAt),
    query: toCheckoutQuery(selection, extra),
  };
}
