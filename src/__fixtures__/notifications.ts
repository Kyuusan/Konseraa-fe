// Dummy in-app notifications per role (no endpoint in the spec yet).
// Customers and organizers share one account, so organizers get both lists.
import { NotificationSchema, type AppNotification } from "@/types/notification";
import { fixtureId } from "./ids";

export type NotificationAudience = "customer" | "organizer" | "admin" | "gatekeeper";

const n = (id: number, fields: Omit<AppNotification, "id">) => ({ id: fixtureId(2300 + id), ...fields });

const CUSTOMER = [
  n(5, {
    type: "booking", title: "Refund request sent", body: "The organizer of Harbour Lights Orchestra is reviewing your refund of $294.00.",
    link: "/orders", is_read: true, created_at: "2026-11-20T09:30:00+07:00",
  }),
  n(1, {
    type: "booking", title: "Your tickets are ready", body: "2 Festival tickets for Neon Arcadia World Tour are in My tickets.",
    link: "/tickets", is_read: false, created_at: "2026-11-19T09:43:00+07:00",
  }),
  n(2, {
    type: "event", title: "Gelora Fest is in a month", body: "Day 1 starts 19 Dec at 3:00 PM. Check the seat map and gate times.",
    link: "/events/gelora-fest-2026", is_read: false, created_at: "2026-11-19T08:00:00+07:00",
  }),
  n(3, {
    type: "booking", title: "Payment reminder", body: "Pay for Seoul Afterglow within the hour, or the order expires and the tickets are released.",
    link: null, is_read: true, created_at: "2026-11-18T18:10:00+07:00",
  }),
  n(4, {
    type: "review", title: "How was Echoes in Bloom?", body: "You checked in on 17 Oct. Leave a rating for other fans.",
    link: "/events/echoes-in-bloom?tab=reviews", is_read: true, created_at: "2026-10-18T10:00:00+07:00",
  }),
];

const ORGANIZER = [
  n(13, {
    type: "organizer", title: "New refund request", body: "Kevin Halim asked for a refund of 1 VIP Deck ticket for Gelora Fest 2026.",
    link: "/organizer/refunds", is_read: false, created_at: "2026-11-22T19:15:00+07:00",
  }),
  n(10, {
    type: "organizer", title: "Event approved and live", body: "Gelora Fest 2026 passed review and is now on sale.",
    link: "/organizer/events/gelora-fest-2026", is_read: false, created_at: "2026-11-19T07:55:00+07:00",
  }),
  n(11, {
    type: "organizer", title: "Changes needed: Midnight Rave Bandung", body: "The crowd permit date does not match the event date.",
    link: "/organizer/events/midnight-rave-bandung", is_read: false, created_at: "2026-11-18T16:30:00+07:00",
  }),
  n(12, {
    type: "payout", title: "Payout sent", body: "$235,980.00 for Echoes in Bloom was sent to BCA •••• 4821.",
    link: "/organizer/payouts", is_read: true, created_at: "2026-10-20T10:42:00+07:00",
  }),
];

const ADMIN = [
  n(20, {
    type: "organizer", title: "New event to review", body: "Paduan Suara Kota by Harmoni Nusantara is waiting for review.",
    link: "/admin/events", is_read: false, created_at: "2026-11-19T07:40:00+07:00",
  }),
  n(21, {
    type: "organizer", title: "New organizer application", body: "Gema Timur Events (Makassar) submitted their verification.",
    link: "/admin/verifications", is_read: false, created_at: "2026-11-19T08:15:00+07:00",
  }),
  n(22, {
    type: "payout", title: "2 payouts due this week", body: "Rimba Sound and Harmoni Nusantara are scheduled for payout.",
    link: "/admin/dashboard", is_read: true, created_at: "2026-11-18T09:00:00+07:00",
  }),
  n(23, {
    type: "system", title: "Refund processed", body: "KNS-261118-455 for Paper Satellites Live was refunded.",
    link: null, is_read: true, created_at: "2026-11-18T12:25:00+07:00",
  }),
];

const GATEKEEPER = [
  n(30, {
    type: "gate", title: "You are assigned to Gelora Fest 2026", body: "Nada Kota Productions added you to both days.",
    link: "/gate", is_read: false, created_at: "2026-11-17T10:00:00+07:00",
  }),
  n(31, {
    type: "gate", title: "Gate opens soon", body: "Neon Arcadia World Tour: scanning opens 12 Dec at 6:00 PM.",
    link: "/gate", is_read: true, created_at: "2026-11-16T09:00:00+07:00",
  }),
];

const LISTS: Record<NotificationAudience, unknown[]> = {
  customer: CUSTOMER,
  organizer: [...ORGANIZER, ...CUSTOMER],
  admin: ADMIN,
  gatekeeper: GATEKEEPER,
};

/** Newest first, as GET /notifications would return them. */
export const getNotifications = (audience: NotificationAudience) =>
  NotificationSchema.array()
    .parse(LISTS[audience])
    .toSorted((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

export const getUnreadCount = (audience: NotificationAudience) =>
  getNotifications(audience).filter((item) => !item.is_read).length;
