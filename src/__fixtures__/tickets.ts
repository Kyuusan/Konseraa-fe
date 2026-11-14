// Dummy stand-in for GET /users/me/tickets and GET /tickets/{id}/qr-code.
import { TicketSchema, type Ticket } from "@/types/ticket";
import { fixtureId } from "./ids";

const ticket = (n: number, fields: Record<string, unknown>) => ({
  id: fixtureId(1100 + n),
  qr_code_url: `https://api.konsera.id/api/v1/tickets/${fixtureId(1100 + n)}/qr-code`,
  holder_name: "Demo User",
  seat_label: null,
  ...fields,
});

export const TICKETS: Ticket[] = TicketSchema.array().parse([
  ticket(1, {
    ticket_code: "KNS-NA-48211", status: "issued", event_title: "Neon Arcadia World Tour", event_slug: "neon-arcadia-world-tour",
    session_name: "Main show", session_start_at: "2026-12-12T20:00:00+07:00", tier_name: "Festival",
    venue_name: "Istora Senayan", venue_timezone: "Asia/Jakarta",
  }),
  ticket(2, {
    ticket_code: "KNS-GF-10734", status: "issued", event_title: "Gelora Fest 2026", event_slug: "gelora-fest-2026",
    session_name: "Day 1", session_start_at: "2026-12-19T15:00:00+07:00", tier_name: "VIP Deck",
    venue_name: "Lapangan Saparua", venue_timezone: "Asia/Jakarta",
  }),
  ticket(3, {
    ticket_code: "KNS-LT-00912", status: "issued", event_title: "Low Tide Sessions", event_slug: "low-tide-sessions",
    session_name: "Evening set", session_start_at: "2026-11-15T19:30:00+07:00", tier_name: "Front Table",
    seat_label: "Table 3, Seat B", venue_name: "Balai Pemuda", venue_timezone: "Asia/Jakarta",
  }),
  ticket(4, {
    ticket_code: "KNS-EB-55120", status: "checked_in", event_title: "Echoes in Bloom", event_slug: "echoes-in-bloom",
    session_name: "Main show", session_start_at: "2026-10-17T19:00:00+07:00", tier_name: "Regular",
    venue_name: "Istora Senayan", venue_timezone: "Asia/Jakarta",
  }),
]);

export const getTicket = (id: string) => TICKETS.find((item) => item.id === id);

/** The rotating QR payload; the real one is signed by the server (rules §7.3). */
export const getTicketQrToken = (ticket: Ticket) => `KONSERA:${ticket.ticket_code}`;
