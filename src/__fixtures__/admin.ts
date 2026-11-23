// Dummy stand-in for the admin dashboard data (GET /admin/financials,
// GET /admin/events/pending and friends). Totals are fixed here, as the backend would send them.
import {
  AdminOverviewSchema,
  AdminTransactionSchema,
  PayoutDueSchema,
  PendingEventReviewSchema,
  PendingVerificationSchema,
} from "@/types/admin";
import { EVENT_REVIEWS, VERIFICATIONS } from "./adminReviews";
import { fixtureId } from "./ids";

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
  VERIFICATIONS.filter(({ verification }) => verification.status === "pending" || verification.status === "in_review").map(
    ({ organizer, verification }) => ({
      organizer_id: organizer.id,
      organizer_name: organizer.company_name,
      organizer_type: organizer.organizer_type,
      city: organizer.city,
      pic_name: verification.person_in_charge.full_name,
      status: verification.status,
      submitted_at: verification.submitted_at,
    }),
  ),
);

export const RECENT_TRANSACTIONS = AdminTransactionSchema.array().parse([
  {
    booking_code: "KNS-261119-118", buyer_name: "Rizky A.", event_title: "Neon Arcadia World Tour", organizer_name: "Nada Kota Productions",
    total_amount: 136.5, platform_fee_amount: 6.5, status: "paid", created_at: "2026-11-19T09:42:00+07:00",
  },
  {
    booking_code: "KNS-261119-117", buyer_name: "Mei L.", event_title: "Seoul Afterglow", organizer_name: "Han River Live",
    total_amount: 378, platform_fee_amount: 18, status: "awaiting_payment", created_at: "2026-11-19T09:31:00+07:00",
  },
  {
    booking_code: "KNS-261119-109", buyer_name: "Bayu S.", event_title: "Bass Assembly NYE", organizer_name: "Lowend Collective",
    total_amount: 126, platform_fee_amount: 6, status: "paid", created_at: "2026-11-19T08:57:00+07:00",
  },
  {
    booking_code: "KNS-261118-482", buyer_name: "Sinta M.", event_title: "Gelora Fest 2026", organizer_name: "Nada Kota Productions",
    total_amount: 73.5, platform_fee_amount: 3.5, status: "paid", created_at: "2026-11-18T14:31:00+07:00",
  },
  {
    booking_code: "KNS-261118-455", buyer_name: "Ayu P.", event_title: "Paper Satellites Live", organizer_name: "Orbit Asia",
    total_amount: 178.5, platform_fee_amount: 8.5, status: "refunded", created_at: "2026-11-18T12:20:00+07:00",
  },
]);

export const PAYOUTS_DUE = PayoutDueSchema.array().parse([
  { id: fixtureId(2201), organizer_name: "Rimba Sound", event_title: "Danau Toba Folk Days", net_amount: 48_210, scheduled_for: "2026-11-21T10:00:00+07:00" },
  { id: fixtureId(2202), organizer_name: "Harmoni Nusantara", event_title: "Simfoni Malam", net_amount: 22_640, scheduled_for: "2026-11-24T10:00:00+07:00" },
  { id: fixtureId(2203), organizer_name: "Nada Kota Productions", event_title: "Neon Arcadia World Tour", net_amount: 141_034.5, scheduled_for: "2026-12-15T10:00:00+07:00" },
]);

/** The signed-in admin (the admin login has no session yet). */
export const ADMIN_USER = {
  full_name: "Super Admin",
  email: "superadmin@konsera.test",
  phone: "+62 21 5550 1000",
  role: "Super admin",
  created_at: "2026-01-05T09:00:00+07:00",
};
