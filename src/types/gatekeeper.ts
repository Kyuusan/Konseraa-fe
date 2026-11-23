import { z } from "zod";

// Gatekeepers are users with the `gatekeeper` role (PRD §3A). The spec has no
// endpoints for creating them or assigning them to events: everything marked
// "not in spec" here is a proposal for the backend.

const IsoDateTime = z.iso.datetime({ offset: true });

export const GATEKEEPER_STATUSES = ["active", "disabled"] as const;

/** Not in spec: a gatekeeper account as the organizer sees it. */
export const GatekeeperSchema = z.object({
  id: z.uuid(),
  organizer_id: z.uuid(),
  full_name: z.string(),
  email: z.email(),
  status: z.enum(GATEKEEPER_STATUSES),
  /** Not in spec: events this gatekeeper may scan for (no assignment table yet). */
  event_ids: z.array(z.uuid()),
  last_active_at: IsoDateTime.nullable(),
  created_at: IsoDateTime,
});
export type Gatekeeper = z.infer<typeof GatekeeperSchema>;

export const GatekeeperFormSchema = z.object({
  full_name: z.string().trim().min(2, "Enter the gatekeeper's name."),
  email: z.email("Enter a valid email."),
  event_ids: z.array(z.string()).min(1, "Assign at least one event."),
  /** Temporary password; the gatekeeper changes it at first sign-in. */
  password: z.string().min(10, "Use at least 10 characters."),
});
export type GatekeeperForm = z.input<typeof GatekeeperFormSchema>;

/** Results of POST /check-ins (openapi: success/duplicate/invalid/expired). */
export const CHECK_IN_RESULTS = ["success", "duplicate", "invalid", "expired"] as const;
export type CheckInResult = (typeof CHECK_IN_RESULTS)[number];

/** Not in spec (the 200 response has no schema): mirrors check_ins plus what the scanner shows. */
export const CheckInSchema = z.object({
  id: z.uuid(),
  result: z.enum(CHECK_IN_RESULTS),
  ticket_code: z.string().nullable(),
  holder_name: z.string().nullable(),
  tier_name: z.string().nullable(),
  scanned_at: IsoDateTime,
  is_offline_sync: z.boolean(),
});
export type CheckIn = z.infer<typeof CheckInSchema>;

/** Not in spec (GET /check-ins/stats/{event_id} has no schema). */
export const CheckInStatsSchema = z.object({
  event_session_id: z.uuid(),
  checked_in: z.int().nonnegative(),
  tickets_sold: z.int().nonnegative(),
  duplicates: z.int().nonnegative(),
  by_tier: z.array(z.object({ tier_name: z.string(), checked_in: z.int().nonnegative(), sold: z.int().nonnegative() })),
});
export type CheckInStats = z.infer<typeof CheckInStatsSchema>;
