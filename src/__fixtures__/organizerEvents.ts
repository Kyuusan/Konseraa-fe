// Dummy stand-in for the organizer's own events and recent sales (no endpoint in
// the spec yet). Three events reuse the public catalogue; the rest are not public.
import { EventSessionSchema, TicketTierSchema } from "@/types/event";
import { OrganizerEventSchema, OrganizerSaleSchema, type OrganizerEvent } from "@/types/organizer";
import { EVENTS, getEventSessions, getEventTicketTiers } from "./events";
import { fixtureId, unsplash } from "./ids";

const fromCatalogue = (slug: string, sales: { tickets_sold: number; ticket_capacity: number; gross_revenue: number }) => {
  const event = EVENTS.find((item) => item.slug === slug);
  if (!event) throw new Error(`Unknown fixture event ${slug}`);
  return { ...event, ...sales, rejection_reason: null, updated_at: "2026-11-10T12:00:00+07:00" };
};

const JAKARTA_VENUE = EVENTS.find((item) => item.slug === "neon-arcadia-world-tour")?.venue;
const BANDUNG_VENUE = EVENTS.find((item) => item.slug === "gelora-fest-2026")?.venue;

const unpublished = (
  n: number,
  fields: { slug: string; title: string; status: string; photo: string; starts_at: string; rejection_reason?: string },
  venue: unknown,
) => ({
  id: fixtureId(1400 + n),
  slug: fields.slug,
  title: fields.title,
  description: "Not public yet.",
  poster_url: unsplash(fields.photo, 800, 1000),
  banner_url: unsplash(fields.photo, 1800, 700),
  status: fields.status,
  min_price: 20,
  max_price: 60,
  venue,
  categories: ["Indie"],
  starts_at: fields.starts_at,
  tickets_sold: 0,
  ticket_capacity: 800,
  gross_revenue: 0,
  rejection_reason: fields.rejection_reason ?? null,
  updated_at: "2026-11-17T16:20:00+07:00",
});

export const ORGANIZER_EVENTS: OrganizerEvent[] = OrganizerEventSchema.array().parse([
  fromCatalogue("neon-arcadia-world-tour", { tickets_sold: 2140, ticket_capacity: 2600, gross_revenue: 151_650 }),
  fromCatalogue("gelora-fest-2026", { tickets_sold: 3820, ticket_capacity: 9000, gross_revenue: 142_300 }),
  fromCatalogue("echoes-in-bloom", { tickets_sold: 5400, ticket_capacity: 5400, gross_revenue: 248_400 }),
  unpublished(1, { slug: "sunset-indie-picnic", title: "Sunset Indie Picnic", status: "pending_review", photo: "photo-1459749411175-04bf5292ceea", starts_at: "2027-01-16T16:00:00+07:00" }, BANDUNG_VENUE),
  unpublished(2, {
    slug: "midnight-rave-bandung", title: "Midnight Rave Bandung", status: "rejected", photo: "photo-1470225620780-dba8ba36b745", starts_at: "2027-02-20T22:00:00+07:00",
    rejection_reason: "The crowd permit is dated for 13 February, but the event is on 20 February. Upload a permit for the correct date.",
  }, BANDUNG_VENUE),
  unpublished(3, { slug: "rooftop-sessions-vol-3", title: "Rooftop Sessions Vol. 3", status: "draft", photo: "photo-1501386761578-eac5c94b800a", starts_at: "2027-03-06T19:00:00+07:00" }, JAKARTA_VENUE),
]);

export const RECENT_SALES = OrganizerSaleSchema.array().parse([
  { booking_code: "KNS-261118-482", buyer_name: "Rizky A.", event_title: "Neon Arcadia World Tour", tier_name: "Festival", quantity: 2, total_amount: 136.5, paid_at: "2026-11-18T14:42:00+07:00" },
  { booking_code: "KNS-261118-477", buyer_name: "Sinta M.", event_title: "Gelora Fest 2026", tier_name: "VIP Deck", quantity: 1, total_amount: 73.5, paid_at: "2026-11-18T14:31:00+07:00" },
  { booking_code: "KNS-261118-469", buyer_name: "Daniel K.", event_title: "Neon Arcadia World Tour", tier_name: "VIP Standing", quantity: 4, total_amount: 504, paid_at: "2026-11-18T13:58:00+07:00" },
  { booking_code: "KNS-261118-455", buyer_name: "Ayu P.", event_title: "Gelora Fest 2026", tier_name: "Regular", quantity: 3, total_amount: 94.5, paid_at: "2026-11-18T12:20:00+07:00" },
  { booking_code: "KNS-261118-431", buyer_name: "Fajar N.", event_title: "Gelora Fest 2026", tier_name: "Group of 4", quantity: 1, total_amount: 105, paid_at: "2026-11-18T10:05:00+07:00" },
]);

export const getOrganizerEvents = () => ORGANIZER_EVENTS;

// Sessions and tiers of the events that are not public yet (catalogue events use their own).
const NOT_PUBLIC_SESSIONS = EventSessionSchema.array().parse([
  { id: fixtureId(1501), name: "Golden hour", start_at: "2027-01-16T16:00:00+07:00", end_at: "2027-01-16T21:00:00+07:00",
    artists: [{ id: fixtureId(1511), name: "Sore Hari", image_url: unsplash("photo-1459749411175-04bf5292ceea", 400, 400) }] },
  { id: fixtureId(1502), name: "Late night", start_at: "2027-02-20T22:00:00+07:00", end_at: "2027-02-21T04:00:00+07:00",
    artists: [{ id: fixtureId(1512), name: "DJ Arka", image_url: unsplash("photo-1470225620780-dba8ba36b745", 400, 400) }] },
]);
const NOT_PUBLIC_TIERS = TicketTierSchema.array().parse([
  { id: fixtureId(1521), name: "Picnic Pass", tier_type: "regular", price: 20, max_per_transaction: 6, available_quota: 600 },
  { id: fixtureId(1522), name: "Lawn Deck", tier_type: "vip", price: 60, max_per_transaction: 4, available_quota: 200 },
  { id: fixtureId(1523), name: "Early Bird", tier_type: "early_bird", price: 20, max_per_transaction: 6, available_quota: 300 },
  { id: fixtureId(1524), name: "General", tier_type: "regular", price: 35, max_per_transaction: 6, available_quota: 500 },
]);
const NOT_PUBLIC_DETAIL: Record<string, { sessions: number[]; tiers: number[] }> = {
  "sunset-indie-picnic": { sessions: [0], tiers: [0, 1] },
  "midnight-rave-bandung": { sessions: [1], tiers: [2, 3] },
};

/** One event with its sessions and tiers, as an organizer event-detail endpoint would return it. */
export function getOrganizerEventDetail(slug: string) {
  const event = ORGANIZER_EVENTS.find((item) => item.slug === slug);
  if (!event) return undefined;
  const local = NOT_PUBLIC_DETAIL[slug];
  return {
    event,
    sessions: local ? local.sessions.map((i) => NOT_PUBLIC_SESSIONS[i]) : getEventSessions(event.id),
    tiers: local ? local.tiers.map((i) => NOT_PUBLIC_TIERS[i]) : getEventTicketTiers(event.id),
  };
}

/** Gross sales per month, oldest first; the last entry is the current month. */
const SALES_BY_MONTH = [
  { month: "2026-06", gross: 38_200 },
  { month: "2026-07", gross: 52_900 },
  { month: "2026-08", gross: 61_400 },
  { month: "2026-09", gross: 97_800 },
  { month: "2026-10", gross: 131_250 },
  { month: "2026-11", gross: 161_800 },
];

/** What a dashboard endpoint would return; totals and changes are the backend's job. */
export function getOrganizerDashboard() {
  const events = ORGANIZER_EVENTS;
  const current = SALES_BY_MONTH.at(-1)?.gross ?? 0;
  const previous = SALES_BY_MONTH.at(-2)?.gross ?? 0;

  return {
    tickets_sold: events.reduce((sum, event) => sum + event.tickets_sold, 0),
    gross_revenue: events.reduce((sum, event) => sum + event.gross_revenue, 0),
    month_gross: current,
    month_change_percent: previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0,
    sales_by_month: SALES_BY_MONTH,
  };
}
