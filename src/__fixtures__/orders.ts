// Dummy stand-in for GET /users/me/bookings. Totals are fixed here as the backend
// would send them. The one open order is built through the checkout fixtures, so
// "Continue payment" opens the real payment page for it. Refund eligibility is
// decided here, as the backend would, from the agreed refund rules.
import { REFUND_CLOSES_DAYS_BEFORE } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { UserOrderSchema, type UserOrder } from "@/types/booking";
import type { OrderRefund } from "@/types/refund";
import { createPayment, holdCartItems, PAYMENT_METHODS, previewBooking } from "./checkout";
import { getEventBySlug, getEventSessions, getEventTicketTiers } from "./events";
import { fixtureId } from "./ids";
import { TICKETS } from "./tickets";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function eventFields(slug: string, sessionIndex = 0) {
  const event = getEventBySlug(slug);
  const session = event && getEventSessions(event.id)[sessionIndex];
  if (!event || !session) throw new Error(`Unknown fixture event ${slug}`);
  return {
    event_slug: event.slug,
    event_title: event.title,
    poster_url: event.poster_url,
    session_name: session.name,
    session_start_at: session.start_at,
    venue_name: event.venue.name,
    venue_timezone: event.venue.timezone,
  };
}

const item = (n: number, tier: number, quantity: number, unit_price: number) => ({
  id: fixtureId(2400 + n),
  ticket_tier_id: fixtureId(400 + tier),
  quantity,
  unit_price,
  line_total: unit_price * quantity,
});

const CLOSED_ORDERS = [
  {
    id: fixtureId(2501), booking_code: "KNS-261101-204", status: "paid", ...eventFields("neon-arcadia-world-tour"),
    items: [item(1, 2, 2, 65)], subtotal_amount: 130, discount_amount: 0, platform_fee_amount: 6.5, total_amount: 136.5,
    ticket_count: 2, payment_method_name: "GoPay", created_at: "2026-11-01T19:02:00+07:00", hold_expires_at: "2026-11-01T19:12:00+07:00",
    paid_at: "2026-11-01T19:04:00+07:00", payment_expires_at: null, refunded_amount: null,
  },
  {
    id: fixtureId(2502), booking_code: "KNS-261104-117", status: "paid", ...eventFields("gelora-fest-2026"),
    items: [item(2, 5, 1, 70)], subtotal_amount: 70, discount_amount: 0, platform_fee_amount: 3.5, total_amount: 73.5,
    ticket_count: 1, payment_method_name: "BCA Virtual Account", created_at: "2026-11-04T10:15:00+07:00", hold_expires_at: "2026-11-04T10:25:00+07:00",
    paid_at: "2026-11-04T12:40:00+07:00", payment_expires_at: null, refunded_amount: null,
  },
  {
    id: fixtureId(2503), booking_code: "KNS-261020-388", status: "expired", ...eventFields("bass-assembly-nye"),
    items: [item(3, 18, 2, 60)], subtotal_amount: 120, discount_amount: 0, platform_fee_amount: 6, total_amount: 126,
    ticket_count: 2, payment_method_name: "Mandiri Virtual Account", created_at: "2026-10-20T21:30:00+07:00", hold_expires_at: "2026-10-20T21:40:00+07:00",
    paid_at: null, payment_expires_at: null, refunded_amount: null,
  },
  {
    id: fixtureId(2504), booking_code: "KNS-261012-051", status: "refunded", ...eventFields("paper-satellites-singapore"),
    items: [item(4, 9, 2, 85)], subtotal_amount: 170, discount_amount: 0, platform_fee_amount: 8.5, total_amount: 178.5,
    ticket_count: 2, payment_method_name: "Credit / debit card", created_at: "2026-10-12T08:45:00+07:00", hold_expires_at: "2026-10-12T08:55:00+07:00",
    paid_at: "2026-10-12T08:47:00+07:00", payment_expires_at: null, refunded_amount: 178.5,
  },
  {
    id: fixtureId(2505), booking_code: "KNS-261003-912", status: "paid", ...eventFields("low-tide-sessions"),
    items: [item(5, 8, 1, 55)], subtotal_amount: 55, discount_amount: 0, platform_fee_amount: 2.75, total_amount: 57.75,
    ticket_count: 1, payment_method_name: "QRIS", created_at: "2026-10-03T14:20:00+07:00", hold_expires_at: "2026-10-03T14:30:00+07:00",
    paid_at: "2026-10-03T14:22:00+07:00", payment_expires_at: null, refunded_amount: null,
  },
  {
    id: fixtureId(2506), booking_code: "KNS-260915-640", status: "paid", ...eventFields("echoes-in-bloom"),
    items: [item(6, 20, 1, 35)], subtotal_amount: 35, discount_amount: 0, platform_fee_amount: 1.75, total_amount: 36.75,
    ticket_count: 1, payment_method_name: "OVO", created_at: "2026-09-15T20:10:00+07:00", hold_expires_at: "2026-09-15T20:20:00+07:00",
    paid_at: "2026-09-15T20:11:00+07:00", payment_expires_at: null, refunded_amount: null,
  },
  {
    id: fixtureId(2507), booking_code: "KNS-261108-560", status: "paid", ...eventFields("harbour-lights-orchestra"),
    items: [item(7, 16, 2, 140)], subtotal_amount: 280, discount_amount: 0, platform_fee_amount: 14, total_amount: 294,
    ticket_count: 2, payment_method_name: "BCA Virtual Account", created_at: "2026-11-08T13:05:00+07:00", hold_expires_at: "2026-11-08T13:15:00+07:00",
    paid_at: "2026-11-08T15:30:00+07:00", payment_expires_at: null, refunded_amount: null,
  },
  {
    id: fixtureId(2508), booking_code: "KNS-261105-733", status: "paid", ...eventFields("bass-assembly-nye"),
    items: [item(8, 18, 2, 60)], subtotal_amount: 120, discount_amount: 0, platform_fee_amount: 6, total_amount: 126,
    ticket_count: 2, payment_method_name: "GoPay", created_at: "2026-11-05T22:10:00+07:00", hold_expires_at: "2026-11-05T22:20:00+07:00",
    paid_at: "2026-11-05T22:11:00+07:00", payment_expires_at: null, refunded_amount: null,
  },
];

/** Which tickets each paid order issued (the API links them by booking). */
const ORDER_TICKETS: Record<string, string[]> = {
  "KNS-261101-204": ["KNS-NA-48211"],
  "KNS-261104-117": ["KNS-GF-10734"],
  "KNS-261003-912": ["KNS-LT-00912"],
  "KNS-260915-640": ["KNS-EB-55120"],
  // KNS-261108-560 has a refund pending: its tickets are on hold and not listed
  // (the spec's ticket statuses have no "on hold").
  "KNS-261105-733": ["KNS-BA-22017", "KNS-BA-22018"],
};

const REFUND_REQUESTS: Record<string, NonNullable<OrderRefund["request"]>> = {
  "KNS-261108-560": { status: "requested", requested_at: "2026-11-20T09:30:00+07:00", rejection_reason: null },
  "KNS-261012-051": { status: "approved", requested_at: "2026-10-14T10:00:00+07:00", rejection_reason: null },
};

type RawOrder = (typeof CLOSED_ORDERS)[number];

/** Agreed rules: full amount, whole order, closes 7 days before (venue time), never with a transferred ticket. */
function refundFor(order: RawOrder, now: number): OrderRefund | null {
  const request = REFUND_REQUESTS[order.booking_code] ?? null;
  if (order.status !== "paid" && !request) return null;

  const start = Date.parse(order.session_start_at);
  const deadline = new Date(start - REFUND_CLOSES_DAYS_BEFORE * DAY).toISOString();
  const tickets = TICKETS.filter((ticket) => ORDER_TICKETS[order.booking_code]?.includes(ticket.ticket_code));

  const blocked = request
    ? null
    : tickets.some((ticket) => ticket.status === "transferred")
      ? "A ticket from this order was sent to someone else, so the order can't be refunded."
      : tickets.some((ticket) => ticket.status === "checked_in") || now >= start
        ? null
        : now >= Date.parse(deadline)
          ? `Refunds closed on ${formatDate(deadline, order.venue_timezone)}, ${REFUND_CLOSES_DAYS_BEFORE} days before the show.`
          : null;

  const happened = now >= start;
  return { eligible: !request && !blocked && !happened, blocked_reason: blocked, deadline, amount: order.total_amount, request };
}

export interface OrderWithResume {
  order: UserOrder;
  /** Only for awaiting_payment: what the payment page needs to reopen it. */
  resume: {
    selection: { eventSlug: string; sessionId: string; items: { ticket_tier_id: string; event_session_id: string; quantity: number }[]; heldUntil: string };
    extra: Record<string, string>;
  } | null;
}

/** An order for Seoul Afterglow by virtual account, started 15 minutes ago (45 left of the hour). */
function openOrder(now: number): OrderWithResume {
  const event = getEventBySlug("seoul-afterglow");
  const session = event && getEventSessions(event.id)[0];
  const method = PAYMENT_METHODS.find((item) => item.code === "bca_va");
  if (!event || !session || !method) throw new Error("Missing fixture data for the open order");

  const startedAt = new Date(now - 15 * MINUTE).toISOString();
  const heldUntil = new Date(now - 15 * MINUTE + 10 * MINUTE).toISOString();
  const items = [{ ticket_tier_id: fixtureId(412), event_session_id: session.id, quantity: 2 }];
  const { booking } = previewBooking(holdCartItems(items, getEventTicketTiers(event.id), heldUntil), undefined);
  const payment = createPayment(booking, method, startedAt);

  return {
    order: UserOrderSchema.parse({
      ...booking,
      ...eventFields("seoul-afterglow"),
      ticket_count: 2,
      payment_method_name: method.name,
      created_at: startedAt,
      paid_at: null,
      payment_expires_at: payment.expires_at,
      refunded_amount: null,
      refund: null,
    }),
    resume: {
      selection: { eventSlug: event.slug, sessionId: session.id, items, heldUntil },
      extra: { method: method.code, started_at: startedAt },
    },
  };
}

/** Newest first. `now` places the open order relative to the current time. */
export function getUserOrders(now = Date.now()): OrderWithResume[] {
  const closed = UserOrderSchema.array()
    .parse(CLOSED_ORDERS.map((order) => ({ ...order, refund: refundFor(order, now) })))
    .map((order) => ({ order, resume: null }));
  return [openOrder(now), ...closed].toSorted((a, b) => Date.parse(b.order.created_at) - Date.parse(a.order.created_at));
}

export const getUserOrder = (bookingCode: string) => getUserOrders().find(({ order }) => order.booking_code === bookingCode)?.order;
