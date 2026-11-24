// Dummy stand-in for the admin dashboard data (GET /admin/financials,
// GET /admin/events/pending and friends). Totals are fixed here, as the backend would send them.
import {
  AdminOverviewSchema,
  PayoutDueSchema,
  PendingEventReviewSchema,
  PendingVerificationSchema,
} from "@/types/admin";
import { ADMIN_PAYOUTS } from "./adminFinance";
import { EVENT_REVIEWS, VERIFICATIONS } from "./adminReviews";

const GROSS_BY_MONTH = [
  { month: "2026-06", gross: 412_300 },
  { month: "2026-07", gross: 486_900 },
  { month: "2026-08", gross: 531_400 },
  { month: "2026-09", gross: 702_150 },
  { month: "2026-10", gross: 864_800 },
  { month: "2026-11", gross: 958_250 },
];

export const getAdminOverview = () =>
  AdminOverviewSchema.parse({
    month_gross: 958_250,
    month_change_percent: 11,
    month_platform_fees: 67_077.5,
    month_tickets: 14_820,
    active_events: 42,
    active_organizers: 27,
    gross_by_month: GROSS_BY_MONTH,
  });

// The dashboard queues are the waiting items of the full review lists.
export const PENDING_EVENT_REVIEWS = PendingEventReviewSchema.array().parse(
  EVENT_REVIEWS.filter((review) => review.status === "pending_review").map((review) => ({
    event_id: review.event_id,
    title: review.title,
    organizer_name: review.organizer_name,
    city: review.venue.city,
    starts_at: review.sessions[0]?.start_at,
    submitted_at: review.submitted_at,
    is_resubmission: review.is_resubmission,
  })),
);

export const PENDING_VERIFICATIONS = PendingVerificationSchema.array().parse(
  VERIFICATIONS.filter(({ organizer }) => organizer.verification_status === "pending" || organizer.verification_status === "in_review").map(
    ({ organizer, owner, submitted_at }) => ({
      organizer_id: organizer.id,
      organizer_name: organizer.company_name,
      legal_entity_type: organizer.legal_entity_type,
      owner_name: owner.full_name,
      status: organizer.verification_status,
      submitted_at,
    }),
  ),
);

export { RECENT_TRANSACTIONS } from "./adminFinance";

/** Open payouts for the dashboard, from the same list as the finance page. */
export const PAYOUTS_DUE = PayoutDueSchema.array().parse(
  ADMIN_PAYOUTS.filter((payout) => payout.status !== "paid").map((payout) => ({
    id: payout.id,
    organizer_name: payout.organizer_name,
    event_title: payout.event_title,
    net_amount: payout.net_amount,
    scheduled_for: payout.scheduled_at,
  })),
);

/** The signed-in admin (the admin login has no session yet). */
export const ADMIN_USER = {
  full_name: "Super Admin",
  email: "superadmin@konsera.test",
  phone: "+62 21 5550 1000",
  role: "Super admin",
  created_at: "2026-01-05T09:00:00+07:00",
};
