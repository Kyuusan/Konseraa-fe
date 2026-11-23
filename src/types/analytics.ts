import { z } from "zod";
import { TICKET_TIER_TYPES } from "./event";

// Not in spec: there is no organizer analytics endpoint yet. Shapes follow what
// PRD §13.7 shows (daily sales, tier breakdown, arrivals per session).

export const DailySalesSchema = z.object({
  date: z.iso.date(),
  tickets: z.int().nonnegative(),
  gross: z.number().nonnegative(),
});
export type DailySales = z.infer<typeof DailySalesSchema>;

export const TierSalesSchema = z.object({
  tier_name: z.string(),
  tier_type: z.enum(TICKET_TIER_TYPES),
  sold: z.int().nonnegative(),
  quota: z.int().nonnegative(),
  gross: z.number().nonnegative(),
  share_percent: z.number().nonnegative(),
});
export type TierSales = z.infer<typeof TierSalesSchema>;

/** Check-ins per 15-minute slot, from the gate opening to its closing. */
export const ArrivalsSchema = z.object({
  slots: z.array(z.string()),
  sessions: z.array(z.object({ session_id: z.uuid(), name: z.string(), counts: z.array(z.int().nonnegative()) })),
  max: z.int().nonnegative(),
});
export type Arrivals = z.infer<typeof ArrivalsSchema>;

export const EventAnalyticsSchema = z.object({
  daily: z.array(DailySalesSchema),
  window_tickets: z.int().nonnegative(),
  window_gross: z.number().nonnegative(),
  tiers: z.array(TierSalesSchema),
  /** null until the gates of at least one session have opened. */
  arrivals: ArrivalsSchema.nullable(),
});
export type EventAnalytics = z.infer<typeof EventAnalyticsSchema>;
