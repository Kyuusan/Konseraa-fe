// Dummy stand-in for the admin finance data: bookings across organizers, payouts
// (backend model `payouts`) and GET /admin/financials. Totals are fixed here, as the
// backend would send them; commission rates come from commission_settings.
import {
  AdminPayoutSchema,
  AdminTransactionSchema,
  FinanceSummarySchema,
  PayoutCandidateSchema,
} from "@/types/admin";
import { fixtureId } from "./ids";

const tx = (
  booking_code: string, buyer_name: string, event_title: string, organizer_name: string,
  total_amount: number, platform_fee_amount: number, status: string, payment_method_name: string, created_at: string,
) => ({ booking_code, buyer_name, event_title, organizer_name, total_amount, platform_fee_amount, status, payment_method_name, created_at });

/** Newest first. */
export const TRANSACTIONS = AdminTransactionSchema.array().parse([
  tx("KNS-261124-031", "Laras W.", "Low Tide Sessions Vol. 3", "Arus Pelan Collective", 52.5, 2.5, "paid", "QRIS", "2026-11-24T08:40:00+07:00"),
  tx("KNS-261119-118", "Rizky A.", "Neon Arcadia World Tour", "Nada Kota Productions", 136.5, 6.5, "paid", "GoPay", "2026-11-19T09:42:00+07:00"),
  tx("KNS-261119-117", "Mei L.", "Seoul Afterglow", "Han River Live", 378, 18, "awaiting_payment", "BCA Virtual Account", "2026-11-19T09:31:00+07:00"),
  tx("KNS-261119-109", "Bayu S.", "Bass Assembly NYE", "Lowend Collective", 126, 6, "paid", "GoPay", "2026-11-19T08:57:00+07:00"),
  tx("KNS-261118-482", "Sinta M.", "Gelora Fest 2026", "Nada Kota Productions", 73.5, 3.5, "paid", "BCA Virtual Account", "2026-11-18T14:31:00+07:00"),
  tx("KNS-261118-455", "Ayu P.", "Paper Satellites Live", "Orbit Asia", 178.5, 8.5, "refunded", "Credit / debit card", "2026-11-18T12:20:00+07:00"),
  tx("KNS-261117-402", "Daniel K.", "Neon Arcadia World Tour", "Nada Kota Productions", 504, 24, "paid", "Credit / debit card", "2026-11-17T20:05:00+07:00"),
  tx("KNS-261117-388", "Arga W.", "Harbour Lights Orchestra", "Harbour Lights Society", 147, 7, "expired", "Mandiri Virtual Account", "2026-11-17T18:44:00+07:00"),
  tx("KNS-261116-290", "Fajar N.", "Gelora Fest 2026", "Nada Kota Productions", 105, 5, "paid", "OVO", "2026-11-16T10:05:00+07:00"),
  tx("KNS-261115-211", "Kevin H.", "Seoul Afterglow", "Han River Live", 189, 9, "cancelled", "Kredivo", "2026-11-15T15:12:00+07:00"),
  tx("KNS-261114-176", "Putri A.", "Neon Arcadia World Tour", "Nada Kota Productions", 136.5, 6.5, "paid", "GoPay", "2026-11-14T21:30:00+07:00"),
  tx("KNS-261112-090", "Wulan S.", "Paduan Suara Kota", "Harmoni Nusantara", 42, 2, "paid", "QRIS", "2026-11-12T09:58:00+07:00"),
]);

/** The dashboard shows the latest five. */
export const RECENT_TRANSACTIONS = TRANSACTIONS.slice(0, 5);

let next = 2900;
const payout = (
  organizer_name: string, event_title: string, gross_amount: number, commission_amount: number,
  status: string, scheduled_at: string, paid_at: string | null = null, bank_reference: string | null = null,
) => ({
  id: fixtureId(next++), organizer_name, event_title, gross_amount, commission_amount,
  net_amount: Math.round((gross_amount - commission_amount) * 100) / 100, status, scheduled_at, paid_at, bank_reference,
});

/** Soonest first for open payouts, newest first for paid ones. */
export const ADMIN_PAYOUTS = AdminPayoutSchema.array().parse([
  payout("Rimba Sound", "Danau Toba Folk Days", 51_840, 3_630, "processing", "2026-11-21T10:00:00+07:00"),
  payout("Harmoni Nusantara", "Simfoni Malam", 24_350, 1_710, "scheduled", "2026-11-27T10:00:00+07:00"),
  payout("Nada Kota Productions", "Neon Arcadia World Tour", 151_650, 10_615.5, "scheduled", "2026-12-15T10:00:00+07:00"),
  payout("Nada Kota Productions", "Gelora Fest 2026", 142_300, 9_961, "scheduled", "2026-12-23T10:00:00+07:00"),
  payout("Nada Kota Productions", "Echoes in Bloom", 248_400, 12_420, "paid", "2026-10-20T10:00:00+07:00", "2026-10-20T10:42:00+07:00", "BCA-20261020-88123"),
  payout("Orbit Asia", "Paper Satellites, Kuala Lumpur", 310_200, 24_816, "paid", "2025-11-25T10:00:00+08:00", "2025-11-25T11:02:00+08:00", "DBS-20251125-10551"),
  payout("Lowend Collective", "Bass Assembly NYE 2025", 189_600, 13_272, "paid", "2026-01-04T10:00:00+08:00", "2026-01-04T10:31:00+08:00", "MDR-20260104-44102"),
]);

/** Events that ended with no payout yet (H+3 is due). */
export const PAYOUT_CANDIDATES = PayoutCandidateSchema.array().parse([
  {
    organizer_id: fixtureId(2111), event_id: fixtureId(2201), organizer_name: "Arus Pelan Collective", event_title: "Low Tide Sessions",
    event_ended_at: "2026-11-15T22:00:00+07:00", gross_amount: 18_975, commission_rate_percent: 6, commission_amount: 1_138.5, net_amount: 17_836.5,
  },
  {
    organizer_id: fixtureId(2112), event_id: fixtureId(2202), organizer_name: "Harbour Lights Society", event_title: "Autumn Strings",
    event_ended_at: "2026-11-19T21:30:00+09:00", gross_amount: 42_600, commission_rate_percent: 7, commission_amount: 2_982, net_amount: 39_618,
  },
]);

export const getFinanceSummary = () =>
  FinanceSummarySchema.parse({
    month_gross: 958_250,
    month_commission: 67_077.5,
    all_time_commission: 412_380,
    month_refunds: 6_412.5,
    scheduled_payouts_total: ADMIN_PAYOUTS.filter((item) => item.status !== "paid").reduce((sum, item) => sum + item.net_amount, 0),
  });
