import { z } from "zod";

// Mirrors the payouts table (PRD §6). The spec only has POST /admin/payouts, so the
// organizer's view of it is "not in spec". Fee and net amounts come from the backend
// (commission_settings); the frontend never computes them (rules §6).

export const PAYOUT_STATUSES = ["scheduled", "processing", "paid"] as const;

export const PayoutSchema = z.object({
  id: z.uuid(),
  event_title: z.string(),
  event_ended_at: z.iso.datetime({ offset: true }),
  gross_amount: z.number().nonnegative(),
  commission_rate_percent: z.number().nonnegative(),
  commission_amount: z.number().nonnegative(),
  net_amount: z.number().nonnegative(),
  /** H+3 after the event ends (PRD §9.2). */
  scheduled_for: z.iso.datetime({ offset: true }),
  paid_at: z.iso.datetime({ offset: true }).nullable(),
  status: z.enum(PAYOUT_STATUSES),
  /** Sales are still open, so the amounts can still change. */
  is_estimate: z.boolean(),
});
export type Payout = z.infer<typeof PayoutSchema>;

/** Not in spec: where payouts are sent (agreed gap: bank account). */
export const PayoutAccountSchema = z.object({
  bank_name: z.string(),
  account_holder: z.string(),
  account_number_last4: z.string().length(4),
});
export type PayoutAccount = z.infer<typeof PayoutAccountSchema>;

export const PayoutSummarySchema = z.object({
  upcoming_total: z.number().nonnegative(),
  paid_total: z.number().nonnegative(),
  next_payout_at: z.iso.datetime({ offset: true }).nullable(),
  fees_total: z.number().nonnegative(),
});
export type PayoutSummary = z.infer<typeof PayoutSummarySchema>;
