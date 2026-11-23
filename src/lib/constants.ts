import type { TicketTier } from "@/types/event";

// Business limits from PRD §9. The backend stays authoritative; the frontend uses
// these only for UX (disabling buttons, validation messages).
export const MAX_TICKETS_PER_TRANSACTION = 6;
/** Ticket transfer locks from H-1 (PRD §9.3). */
export const TRANSFER_LOCK_HOURS = 24;
/** The e-ticket QR token rotates every 30 seconds (PRD §7.1). */
export const QR_REFRESH_SECONDS = 30;

export const TIER_TYPE_LABELS: Record<TicketTier["tier_type"], string> = {
  early_bird: "Early bird",
  regular: "Regular",
  vip: "VIP",
  vvip: "VVIP",
  group_package: "Group package",
};

/** Gate window (PRD §9.3): opens 2 hours before a session starts, closes 1 hour after. */
export const GATE_OPENS_HOURS_BEFORE = 2;
export const GATE_CLOSES_HOURS_AFTER = 1;

/** Refund requests close 7 days before the show, in venue time (PRD §9.1). */
export const REFUND_CLOSES_DAYS_BEFORE = 7;

/**
 * Unpaid orders expire after 1 hour for every payment method (agreed rule; replaces
 * PRD §9.2's 24 h for virtual accounts and 15 min for e-wallets). The backend sets
 * the real expires_at; the frontend only counts down to it and explains the rule.
 */
export const UNPAID_ORDER_EXPIRY_MINUTES = 60;
