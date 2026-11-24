// Dummy stand-in for the organizer's promo codes (no endpoint in the spec yet).
// Statuses are what the backend would compute for 19 Nov 2026.
import { PromoSchema, type Promo } from "@/types/promo";
import { fixtureId } from "./ids";
import { ORGANIZER_EVENTS } from "./organizerEvents";

const eventId = (slug: string) => {
  const event = ORGANIZER_EVENTS.find((item) => item.slug === slug);
  if (!event) throw new Error(`Unknown fixture event ${slug}`);
  return event.id;
};

export const PROMOS: Promo[] = PromoSchema.array().parse([
  {
    id: fixtureId(1601), code: "NEON15", discount_type: "percentage", discount_value: 15, max_discount_amount: 20, event_id: eventId("neon-arcadia-world-tour"),
    usage_limit: 300, per_user_limit: 1, used_count: 184, starts_at: "2026-11-01T00:00:00+07:00", ends_at: "2026-12-05T23:59:00+07:00",
    is_active: true, status: "active",
  },
  {
    id: fixtureId(1602), code: "GELORA10", discount_type: "fixed", discount_value: 10, event_id: eventId("gelora-fest-2026"),
    usage_limit: 500, per_user_limit: 2, used_count: 97, starts_at: "2026-11-10T00:00:00+07:00", ends_at: "2026-12-15T23:59:00+07:00",
    is_active: true, status: "active",
  },
  {
    id: fixtureId(1603), code: "NADAKOTA", discount_type: "percentage", discount_value: 5, event_id: null,
    usage_limit: 1000, per_user_limit: 1, used_count: 0, starts_at: "2026-12-01T00:00:00+07:00", ends_at: "2026-12-31T23:59:00+07:00",
    is_active: true, status: "scheduled",
  },
  {
    id: fixtureId(1604), code: "EARLYNEON", discount_type: "fixed", discount_value: 8, event_id: eventId("neon-arcadia-world-tour"),
    usage_limit: 150, per_user_limit: 1, used_count: 150, starts_at: "2026-09-15T00:00:00+07:00", ends_at: "2026-11-30T23:59:00+07:00",
    is_active: true, status: "used_up",
  },
  {
    id: fixtureId(1605), code: "BLOOM20", discount_type: "percentage", discount_value: 20, event_id: eventId("echoes-in-bloom"),
    usage_limit: 200, per_user_limit: 1, used_count: 143, starts_at: "2026-08-01T00:00:00+07:00", ends_at: "2026-10-10T23:59:00+07:00",
    is_active: true, status: "expired",
  },
  {
    id: fixtureId(1606), code: "CREW50", discount_type: "percentage", discount_value: 50, event_id: eventId("gelora-fest-2026"),
    usage_limit: 40, per_user_limit: 1, used_count: 12, starts_at: "2026-11-01T00:00:00+07:00", ends_at: "2026-12-18T23:59:00+07:00",
    is_active: false, status: "inactive",
  },
]);

export const getPromos = () => PROMOS;
