// Dummy stand-in for POST /check-ins, GET /check-ins/stats and /check-ins/logs.
// The real validation (signature, gate window, one-time scan) is the backend's job.
import { CheckInSchema, CheckInStatsSchema, type CheckInResult } from "@/types/gatekeeper";
import { fixtureId } from "./ids";
import { TICKETS } from "./tickets";

type GateTicket = { code: string; session_id: string; holder: string; tier: string; checked_in: boolean };

const NEON_SHOW = fixtureId(201);
const GELORA_DAY_1 = fixtureId(202);
const GELORA_DAY_2 = fixtureId(203);

const NAMES = ["Rizky Aditya", "Sinta Maharani", "Daniel Kurnia", "Ayu Pertiwi", "Fajar Nugroho", "Laras Wening", "Kevin Halim", "Putri Anjani"];

const pool = (prefix: string, session: string, tiers: string[], start: number): GateTicket[] =>
  NAMES.map((holder, i) => ({
    code: `KNS-${prefix}-${String(start + i).padStart(5, "0")}`,
    session_id: session,
    holder,
    tier: tiers[i % tiers.length],
    // The first two in every pool are already inside, to try a duplicate scan.
    checked_in: i < 2,
  }));

const fromMyTickets = TICKETS.filter((ticket) => ["KNS-NA-48211", "KNS-GF-10734"].includes(ticket.ticket_code)).map(
  (ticket): GateTicket => ({
    code: ticket.ticket_code,
    session_id: ticket.ticket_code.startsWith("KNS-NA") ? NEON_SHOW : GELORA_DAY_1,
    holder: ticket.holder_name,
    tier: ticket.tier_name,
    checked_in: false,
  }),
);

const GATE_TICKETS: GateTicket[] = [
  ...pool("NA", NEON_SHOW, ["Festival", "VIP Standing", "Early Bird"], 30101),
  ...pool("GF", GELORA_DAY_1, ["Regular", "VIP Deck", "Group of 4"], 40101),
  ...pool("GF", GELORA_DAY_2, ["Regular", "VIP Deck"], 50101),
  ...fromMyTickets,
];

/** The e-ticket QR carries "KONSERA:<code>"; the gate also accepts the code typed in. */
export const normalizeScan = (raw: string) => raw.trim().toUpperCase().replace(/^KONSERA:/, "");

export interface ScanOutcome {
  result: CheckInResult;
  ticket_code: string;
  holder_name: string | null;
  tier_name: string | null;
  message: string;
}

/**
 * Simulates POST /check-ins for one session. `scannedCodes` holds the codes this
 * device already admitted, since nothing is written back to the fixtures.
 */
export function checkInTicket(raw: string, sessionId: string, scannedCodes: readonly string[]): ScanOutcome {
  const code = normalizeScan(raw);
  const ticket = GATE_TICKETS.find((item) => item.code === code);

  if (!ticket) {
    return { result: "invalid", ticket_code: code, holder_name: null, tier_name: null, message: "This ticket does not exist. Do not let them in." };
  }
  const known = { ticket_code: ticket.code, holder_name: ticket.holder, tier_name: ticket.tier };
  if (ticket.session_id !== sessionId) {
    return { result: "expired", ...known, message: "This ticket is for another session." };
  }
  if (ticket.checked_in || scannedCodes.includes(ticket.code)) {
    return { result: "duplicate", ...known, message: "Already scanned. Check the holder's ID before letting them in." };
  }
  return { result: "success", ...known, message: "Valid ticket. Let them in." };
}

/** Codes to try the scanner without a phone: one of each outcome (development only). */
export function getDemoCodes(sessionId: string) {
  const own = GATE_TICKETS.filter((item) => item.session_id === sessionId);
  const other = GATE_TICKETS.find((item) => item.session_id !== sessionId);
  return [
    { label: "Valid", code: own.find((item) => !item.checked_in)?.code },
    { label: "Already used", code: own.find((item) => item.checked_in)?.code },
    { label: "Other session", code: other?.code },
    { label: "Fake", code: "KNS-XX-00000" },
  ].filter((item): item is { label: string; code: string } => Boolean(item.code));
}

const STATS = CheckInStatsSchema.array().parse([
  {
    event_session_id: NEON_SHOW, checked_in: 1286, tickets_sold: 2140, duplicates: 14,
    by_tier: [
      { tier_name: "Early Bird", checked_in: 402, sold: 600 },
      { tier_name: "Festival", checked_in: 712, sold: 1240 },
      { tier_name: "VIP Standing", checked_in: 172, sold: 300 },
    ],
  },
  {
    event_session_id: GELORA_DAY_1, checked_in: 1504, tickets_sold: 1980, duplicates: 9,
    by_tier: [
      { tier_name: "Regular", checked_in: 1210, sold: 1500 },
      { tier_name: "VIP Deck", checked_in: 214, sold: 320 },
      { tier_name: "Group of 4", checked_in: 80, sold: 160 },
    ],
  },
  {
    event_session_id: GELORA_DAY_2, checked_in: 0, tickets_sold: 1840, duplicates: 0,
    by_tier: [
      { tier_name: "Regular", checked_in: 0, sold: 1520 },
      { tier_name: "VIP Deck", checked_in: 0, sold: 320 },
    ],
  },
]);

export const getCheckInStats = (sessionId: string) => STATS.find((item) => item.event_session_id === sessionId);

const log = (n: number, result: CheckInResult, code: string | null, holder: string | null, tier: string | null, at: string) => ({
  id: fixtureId(1800 + n), result, ticket_code: code, holder_name: holder, tier_name: tier, scanned_at: at, is_offline_sync: n === 4,
});

const LOGS: Record<string, unknown[]> = {
  [NEON_SHOW]: [
    log(1, "success", "KNS-NA-30102", "Sinta Maharani", "VIP Standing", "2026-12-12T19:42:10+07:00"),
    log(2, "duplicate", "KNS-NA-30101", "Rizky Aditya", "Festival", "2026-12-12T19:41:52+07:00"),
    log(3, "success", "KNS-NA-30101", "Rizky Aditya", "Festival", "2026-12-12T19:38:05+07:00"),
    log(4, "invalid", "KNS-XX-12345", null, null, "2026-12-12T19:36:40+07:00"),
    log(5, "success", "KNS-NA-29988", "Nadia Putri", "Early Bird", "2026-12-12T19:35:18+07:00"),
  ],
  [GELORA_DAY_1]: [
    log(6, "success", "KNS-GF-40102", "Sinta Maharani", "VIP Deck", "2026-12-19T15:22:31+07:00"),
    log(7, "expired", "KNS-GF-50101", "Rizky Aditya", "Regular", "2026-12-19T15:20:02+07:00"),
    log(8, "success", "KNS-GF-40101", "Rizky Aditya", "Regular", "2026-12-19T15:18:44+07:00"),
  ],
};

export const getCheckInLogs = (sessionId: string) => CheckInSchema.array().parse(LOGS[sessionId] ?? []);
