// Dummy refund requests on the demo organizer's events (no endpoint in the spec).
// The backend only lets through requests that meet the rules (7 days, no transfer).
import { RefundRequestSchema } from "@/types/refund";
import { fixtureId } from "./ids";

const NEON = { event_title: "Neon Arcadia World Tour", session_name: "Main show", session_start_at: "2026-12-12T20:00:00+07:00", venue_timezone: "Asia/Jakarta" };
const GELORA_1 = { event_title: "Gelora Fest 2026", session_name: "Day 1", session_start_at: "2026-12-19T15:00:00+07:00", venue_timezone: "Asia/Jakarta" };
const GELORA_2 = { event_title: "Gelora Fest 2026", session_name: "Day 2", session_start_at: "2026-12-20T15:00:00+07:00", venue_timezone: "Asia/Jakarta" };

export const REFUND_REQUESTS = RefundRequestSchema.array().parse([
  {
    id: fixtureId(2701), booking_code: "KNS-261102-318", buyer_name: "Putri Anjani", buyer_email: "putri.anjani@gmail.com", ...NEON,
    tier_summary: "2 × Festival", ticket_count: 2, amount: 136.5, reason: "cannot_attend",
    note: "I have to travel for work that week.", status: "requested",
    requested_at: "2026-11-21T08:40:00+07:00", decided_at: null, rejection_reason: null,
  },
  {
    id: fixtureId(2702), booking_code: "KNS-261109-045", buyer_name: "Kevin Halim", buyer_email: "kevin.h@outlook.com", ...GELORA_2,
    tier_summary: "1 × VIP Deck", ticket_count: 1, amount: 73.5, reason: "event_changed",
    note: "My favourite band moved from Day 2 to Day 1.", status: "requested",
    requested_at: "2026-11-22T19:15:00+07:00", decided_at: null, rejection_reason: null,
  },
  {
    id: fixtureId(2705), booking_code: "KNS-261112-603", buyer_name: "Fajar Nugroho", buyer_email: "fajar.n@gmail.com", ...GELORA_1,
    tier_summary: "1 × Group of 4", ticket_count: 4, amount: 105, reason: "cannot_attend",
    note: null, status: "requested",
    requested_at: "2026-11-23T07:50:00+07:00", decided_at: null, rejection_reason: null,
  },
  {
    id: fixtureId(2703), booking_code: "KNS-261030-772", buyer_name: "Laras Wening", buyer_email: "laras.w@gmail.com", ...GELORA_1,
    tier_summary: "4 × Regular", ticket_count: 4, amount: 126, reason: "bought_by_mistake",
    note: "Bought Day 1 instead of Day 2.", status: "approved",
    requested_at: "2026-11-01T10:00:00+07:00", decided_at: "2026-11-01T15:20:00+07:00", rejection_reason: null,
  },
  {
    id: fixtureId(2704), booking_code: "KNS-261025-190", buyer_name: "Bayu Saputra", buyer_email: "bayu.s@yahoo.com", ...NEON,
    tier_summary: "1 × VIP Standing", ticket_count: 1, amount: 126, reason: "other",
    note: "Found a cheaper ticket from someone else.", status: "rejected",
    requested_at: "2026-10-28T21:00:00+07:00", decided_at: "2026-10-29T09:10:00+07:00",
    rejection_reason: "Buying elsewhere is not covered by this event's refund policy.",
  },
]);
