import { z } from "zod";

export const TICKET_STATUSES = [
  "issued",
  "transferred",
  "checked_in",
  "expired",
  "cancelled",
  "void",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

// Shape follows openapi-spec.yaml. Fields marked "not in spec" are what the
// e-ticket screen (PRD §13.6) shows; confirm with backend.
export const TicketSchema = z.object({
  id: z.uuid(),
  ticket_code: z.string(),
  status: z.enum(TICKET_STATUSES),
  qr_code_url: z.url(),
  event_title: z.string(),
  session_start_at: z.iso.datetime({ offset: true }),
  /** Not in spec. */
  event_slug: z.string(),
  /** Not in spec. */
  session_name: z.string(),
  /** Not in spec. */
  tier_name: z.string(),
  /** Not in spec: null for non-seated events. */
  seat_label: z.string().nullable(),
  /** Not in spec. */
  venue_name: z.string(),
  /** Not in spec: IANA zone of the venue. */
  venue_timezone: z.string(),
  /** Not in spec: shown in the e-ticket watermark (PRD §13.6). */
  holder_name: z.string(),
});
export type Ticket = z.infer<typeof TicketSchema>;
