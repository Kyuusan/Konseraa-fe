// Business limits from PRD §9. The backend stays authoritative; the frontend uses
// these only for UX (disabling buttons, validation messages).
export const MAX_TICKETS_PER_TRANSACTION = 6;
/** Ticket transfer locks from H-1 (PRD §9.3). */
export const TRANSFER_LOCK_HOURS = 24;
/** The e-ticket QR token rotates every 30 seconds (PRD §7.1). */
export const QR_REFRESH_SECONDS = 30;
