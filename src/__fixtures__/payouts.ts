// Dummy stand-in for the organizer's payouts (not in the spec yet). Fee rates come
// from commission_settings on the backend; here they are fixed per row.
import { PayoutAccountSchema, PayoutSchema, PayoutSummarySchema, type Payout } from "@/types/payout";
import { fixtureId } from "./ids";

export const PAYOUTS: Payout[] = PayoutSchema.array().parse([
  {
    id: fixtureId(1901), event_title: "Gelora Fest 2026", event_ended_at: "2026-12-20T23:00:00+07:00",
    gross_amount: 142_300, commission_rate_percent: 7, commission_amount: 9_961, net_amount: 132_339,
    scheduled_for: "2026-12-23T10:00:00+07:00", paid_at: null, status: "scheduled", is_estimate: true,
  },
  {
    id: fixtureId(1902), event_title: "Neon Arcadia World Tour", event_ended_at: "2026-12-12T23:00:00+07:00",
    gross_amount: 151_650, commission_rate_percent: 7, commission_amount: 10_615.5, net_amount: 141_034.5,
    scheduled_for: "2026-12-15T10:00:00+07:00", paid_at: null, status: "scheduled", is_estimate: true,
  },
  {
    id: fixtureId(1903), event_title: "Echoes in Bloom", event_ended_at: "2026-10-17T22:30:00+07:00",
    gross_amount: 248_400, commission_rate_percent: 5, commission_amount: 12_420, net_amount: 235_980,
    scheduled_for: "2026-10-20T10:00:00+07:00", paid_at: "2026-10-20T10:42:00+07:00", status: "paid", is_estimate: false,
  },
  {
    id: fixtureId(1904), event_title: "Kota Lama Jazz Night", event_ended_at: "2026-08-22T22:00:00+07:00",
    gross_amount: 38_750, commission_rate_percent: 8, commission_amount: 3_100, net_amount: 35_650,
    scheduled_for: "2026-08-25T10:00:00+07:00", paid_at: "2026-08-25T11:05:00+07:00", status: "paid", is_estimate: false,
  },
  {
    id: fixtureId(1905), event_title: "Indie Weekender", event_ended_at: "2026-06-14T23:00:00+07:00",
    gross_amount: 61_200, commission_rate_percent: 8, commission_amount: 4_896, net_amount: 56_304,
    scheduled_for: "2026-06-17T10:00:00+07:00", paid_at: "2026-06-17T09:58:00+07:00", status: "paid", is_estimate: false,
  },
]);

export const PAYOUT_ACCOUNT = PayoutAccountSchema.parse({
  bank_name: "BCA",
  account_holder: "Nada Kota Productions",
  account_number_last4: "4821",
});

/** What a summary endpoint would return. */
export function getPayoutSummary() {
  const upcoming = PAYOUTS.filter((payout) => payout.status !== "paid");
  const paid = PAYOUTS.filter((payout) => payout.status === "paid");
  return PayoutSummarySchema.parse({
    upcoming_total: upcoming.reduce((sum, payout) => sum + payout.net_amount, 0),
    paid_total: paid.reduce((sum, payout) => sum + payout.net_amount, 0),
    next_payout_at: upcoming.map((payout) => payout.scheduled_for).toSorted()[0] ?? null,
    fees_total: PAYOUTS.reduce((sum, payout) => sum + payout.commission_amount, 0),
  });
}
