import { z } from "zod";
import { BOOKING_STATUSES } from "./booking";
import { EventSessionSchema, TicketTierSchema, VenueSchema } from "./event";
import {
  DocumentFileSchema,
  ORGANIZER_TYPES,
  ORGANIZER_VERIFICATION_STATUSES,
  OrganizerSchema,
  OrganizerVerificationSchema,
} from "./organizer";

// The admin endpoints in the spec (GET /admin/events/pending, /admin/financials)
// have no response schemas, so every shape here is "not in spec".

const IsoDateTime = z.iso.datetime({ offset: true });

/** One event waiting in GET /admin/events/pending. */
export const PendingEventReviewSchema = z.object({
  event_id: z.uuid(),
  title: z.string(),
  organizer_name: z.string(),
  city: z.string(),
  starts_at: IsoDateTime,
  submitted_at: IsoDateTime,
  /** Resubmitted after a rejection. */
  is_resubmission: z.boolean(),
});
export type PendingEventReview = z.infer<typeof PendingEventReviewSchema>;

/** One organizer application waiting for KYC review. */
export const PendingVerificationSchema = z.object({
  organizer_id: z.uuid(),
  organizer_name: z.string(),
  organizer_type: z.enum(ORGANIZER_TYPES),
  city: z.string(),
  pic_name: z.string(),
  status: z.enum(ORGANIZER_VERIFICATION_STATUSES),
  submitted_at: IsoDateTime,
});
export type PendingVerification = z.infer<typeof PendingVerificationSchema>;

export const AdminTransactionSchema = z.object({
  booking_code: z.string(),
  buyer_name: z.string(),
  event_title: z.string(),
  organizer_name: z.string(),
  total_amount: z.number().nonnegative(),
  platform_fee_amount: z.number().nonnegative(),
  status: z.enum(BOOKING_STATUSES),
  created_at: IsoDateTime,
});
export type AdminTransaction = z.infer<typeof AdminTransactionSchema>;

export const PayoutDueSchema = z.object({
  id: z.uuid(),
  organizer_name: z.string(),
  event_title: z.string(),
  net_amount: z.number().nonnegative(),
  scheduled_for: IsoDateTime,
});
export type PayoutDue = z.infer<typeof PayoutDueSchema>;

/** What GET /admin/financials would need to return for the dashboard. */
export const AdminOverviewSchema = z.object({
  month_gross: z.number().nonnegative(),
  month_change_percent: z.number(),
  month_platform_fees: z.number().nonnegative(),
  month_tickets: z.int().nonnegative(),
  active_events: z.int().nonnegative(),
  active_organizers: z.int().nonnegative(),
  gross_by_month: z.array(z.object({ month: z.string(), gross: z.number().nonnegative() })),
});
export type AdminOverview = z.infer<typeof AdminOverviewSchema>;

/** Not in spec: an organizer application as the admin reviews it. */
export const AdminVerificationSchema = z.object({
  organizer: OrganizerSchema,
  verification: OrganizerVerificationSchema,
});
export type AdminVerification = z.infer<typeof AdminVerificationSchema>;

export const EVENT_REVIEW_STATUSES = ["pending_review", "approved", "rejected"] as const;

/** Not in spec: everything an admin checks before PUT /admin/events/{id}/approve. */
export const AdminEventReviewSchema = z.object({
  event_id: z.uuid(),
  title: z.string(),
  organizer_name: z.string(),
  description: z.string(),
  poster_url: z.url(),
  categories: z.array(z.string()),
  venue: VenueSchema,
  address: z.string(),
  sessions: z.array(EventSessionSchema),
  tiers: z.array(TicketTierSchema),
  seat_map_url: z.string().nullable(),
  /** The crowd permit / venue approval for this event (agreed rule). */
  permit: DocumentFileSchema,
  status: z.enum(EVENT_REVIEW_STATUSES),
  is_resubmission: z.boolean(),
  previous_rejection_reason: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  submitted_at: IsoDateTime,
  decided_at: IsoDateTime.nullable(),
});
export type AdminEventReview = z.infer<typeof AdminEventReviewSchema>;

/** PUT /admin/events/{id}/approve body (in spec); the same shape is used for organizers. */
export const ReviewDecisionSchema = z.discriminatedUnion("approved", [
  z.object({ approved: z.literal(true) }),
  z.object({
    approved: z.literal(false),
    rejection_reason: z.string().trim().min(15, "Explain what to fix in at least 15 characters."),
  }),
]);
export type ReviewDecision = z.infer<typeof ReviewDecisionSchema>;
