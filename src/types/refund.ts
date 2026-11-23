import { z } from "zod";

// Not in spec: the spec only has POST /bookings/{id}/cancel. Refund rules agreed
// with the product owner: full amount, whole order, decided by the organizer,
// closed 7 days before the show (venue time), never for an order with a
// transferred ticket. The backend enforces them; the frontend only explains.

const IsoDateTime = z.iso.datetime({ offset: true });

export const REFUND_REASONS = ["cannot_attend", "bought_by_mistake", "event_changed", "other"] as const;
export type RefundReason = (typeof REFUND_REASONS)[number];

export const REFUND_REASON_LABELS: Record<RefundReason, string> = {
  cannot_attend: "I can't attend anymore",
  bought_by_mistake: "I bought it by mistake",
  event_changed: "The event changed (date, venue or line-up)",
  other: "Something else",
};

export const REFUND_REQUEST_STATUSES = ["requested", "approved", "rejected"] as const;
export type RefundRequestStatus = (typeof REFUND_REQUEST_STATUSES)[number];

/** What the buyer submits. */
export const RefundRequestFormSchema = z
  .object({
    reason: z.enum(REFUND_REASONS, "Pick a reason."),
    note: z.string().trim().max(500, "Keep it under 500 characters."),
    acknowledged: z.literal(true, "Confirm that your tickets will stop working."),
  })
  .refine((value) => value.reason !== "other" || value.note.length >= 10, {
    path: ["note"],
    message: "Tell the organizer what happened (at least 10 characters).",
  });
export type RefundRequestForm = z.input<typeof RefundRequestFormSchema>;

/** Refund state of one order, as the backend would attach it to the order. */
export const OrderRefundSchema = z.object({
  /** Whether a request can be made now. */
  eligible: z.boolean(),
  /** Why not, when it cannot. */
  blocked_reason: z.string().nullable(),
  /** Last moment to ask: 7 days before the first session, in venue time. */
  deadline: IsoDateTime.nullable(),
  /** Full amount paid (agreed rule). */
  amount: z.number().nonnegative(),
  request: z
    .object({
      status: z.enum(REFUND_REQUEST_STATUSES),
      requested_at: IsoDateTime,
      rejection_reason: z.string().nullable(),
    })
    .nullable(),
});
export type OrderRefund = z.infer<typeof OrderRefundSchema>;

/** A refund request as the organizer reviews it. */
export const RefundRequestSchema = z.object({
  id: z.uuid(),
  booking_code: z.string(),
  buyer_name: z.string(),
  buyer_email: z.email(),
  event_title: z.string(),
  session_name: z.string(),
  session_start_at: IsoDateTime,
  venue_timezone: z.string(),
  tier_summary: z.string(),
  ticket_count: z.int().positive(),
  amount: z.number().nonnegative(),
  reason: z.enum(REFUND_REASONS),
  note: z.string().nullable(),
  status: z.enum(REFUND_REQUEST_STATUSES),
  requested_at: IsoDateTime,
  decided_at: IsoDateTime.nullable(),
  rejection_reason: z.string().nullable(),
});
export type RefundRequest = z.infer<typeof RefundRequestSchema>;
