import { z } from "zod";
import { BOOKING_STATUSES } from "./booking";
import { USER_ROLES, USER_STATUSES } from "./user";
import { EventSessionSchema, TicketTierSchema, VenueLayoutSchema, VenueSchema } from "./event";
import {
  AccountOwnerSchema,
  DocumentFileSchema,
  LEGAL_ENTITY_TYPES,
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
  legal_entity_type: z.enum(LEGAL_ENTITY_TYPES),
  owner_name: z.string(),
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
  /** Not in spec: payment_methods.name of the booking's payment. */
  payment_method_name: z.string().nullable().default(null),
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

/** An organizer application as the admin reviews it: the organizer, its owner and its documents. */
export const AdminVerificationSchema = z.object({
  organizer: OrganizerSchema,
  owner: AccountOwnerSchema,
  documents: z.array(OrganizerVerificationSchema),
  submitted_at: IsoDateTime,
  reviewed_at: IsoDateTime.nullable(),
  rejection_reason: z.string().nullable(),
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
  /** The venue's sections and seats the tiers point to (backend models). */
  layout: VenueLayoutSchema,
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

/** A row of GET /admin/users (users + user_profiles + roles in the backend models). */
export const AdminUserSchema = z.object({
  id: z.uuid(),
  full_name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  city: z.string().nullable(),
  status: z.enum(USER_STATUSES),
  roles: z.array(z.enum(USER_ROLES)),
  created_at: IsoDateTime,
  last_login_at: IsoDateTime.nullable(),
});
export type AdminUser = z.infer<typeof AdminUserSchema>;

/** Body of PUT /admin/users/{id}/status (in spec). */
export const UserStatusChangeSchema = z.object({ status: z.enum(USER_STATUSES) });

/** payouts in the backend models, as the admin finance page lists them. */
export const AdminPayoutSchema = z.object({
  id: z.uuid(),
  organizer_name: z.string(),
  event_title: z.string(),
  gross_amount: z.number().nonnegative(),
  commission_amount: z.number().nonnegative(),
  net_amount: z.number().nonnegative(),
  status: z.enum(["scheduled", "processing", "paid"]),
  scheduled_at: IsoDateTime,
  paid_at: IsoDateTime.nullable(),
  bank_reference: z.string().nullable(),
});
export type AdminPayout = z.infer<typeof AdminPayoutSchema>;

/** A finished event with no payout yet: what POST /admin/payouts { organizer_id, event_id } schedules. */
export const PayoutCandidateSchema = z.object({
  organizer_id: z.uuid(),
  event_id: z.uuid(),
  organizer_name: z.string(),
  event_title: z.string(),
  event_ended_at: IsoDateTime,
  gross_amount: z.number().nonnegative(),
  /** From commission_settings (event → organizer → global), worked out by the backend. */
  commission_rate_percent: z.number().nonnegative(),
  commission_amount: z.number().nonnegative(),
  net_amount: z.number().nonnegative(),
});
export type PayoutCandidate = z.infer<typeof PayoutCandidateSchema>;

/** What GET /admin/financials would return for the finance page. */
export const FinanceSummarySchema = z.object({
  month_gross: z.number().nonnegative(),
  month_commission: z.number().nonnegative(),
  all_time_commission: z.number().nonnegative(),
  month_refunds: z.number().nonnegative(),
  scheduled_payouts_total: z.number().nonnegative(),
});
export type FinanceSummary = z.infer<typeof FinanceSummarySchema>;

/**
 * An admin refund that skips the 7-day rule for force majeure (PRD §9.1). Becomes a
 * refunds row (backend models) with the reason and processed_by = the admin.
 */
export const ForceRefundSchema = z.object({
  reason: z.string().trim().min(15, "Say what happened in at least 15 characters."),
});
