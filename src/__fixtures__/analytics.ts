// Dummy stand-in for an organizer analytics endpoint (not in the spec yet).
// Every total and share is produced here, as the backend would, not in components.
import { EventAnalyticsSchema, type EventAnalytics } from "@/types/analytics";
import type { OrganizerEvent } from "@/types/organizer";
import { getEventSessions, getEventTicketTiers } from "./events";
import { fixtureId } from "./ids";

/** The demo's "today": sales charts stop here for events that have not happened yet. */
const TODAY = "2026-11-19";
const DAYS = 30;

/** Tickets sold per tier, in the order of the event's tiers. */
const TIER_SOLD: Record<string, number[]> = {
  [fixtureId(1)]: [600, 1240, 300],
  [fixtureId(2)]: [3000, 640, 180],
  [fixtureId(8)]: [4600, 800],
};

/** Check-ins per 15 minutes from the gate opening (2 h before) to closing (1 h after). */
const ARRIVALS: Record<string, number[]> = {
  [fixtureId(209)]: [120, 260, 410, 580, 720, 810, 760, 620, 420, 250, 120, 60],
};

const round2 = (value: number) => Math.round(value * 100) / 100;

function dailySales(event: OrganizerEvent) {
  const last = new Date(`${[TODAY, event.starts_at.slice(0, 10)].toSorted()[0]}T00:00:00Z`);
  const average = event.tickets_sold > 0 ? event.gross_revenue / event.tickets_sold : 0;
  const windowTickets = Math.round(event.tickets_sold * 0.45);
  // Sales build up towards the show, with a weekly rhythm.
  const weights = Array.from({ length: DAYS }, (_, i) => (i + 4) * (1 + 0.35 * Math.sin(i * 0.9)));
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  return weights.map((weight, i) => {
    const date = new Date(last);
    date.setUTCDate(last.getUTCDate() - (DAYS - 1 - i));
    const tickets = Math.round((weight / total) * windowTickets);
    return { date: date.toISOString().slice(0, 10), tickets, gross: round2(tickets * average) };
  });
}

function tierSales(event: OrganizerEvent) {
  const tiers = getEventTicketTiers(event.id);
  const sold = TIER_SOLD[event.id] ?? tiers.map(() => 0);
  const value = tiers.reduce((sum, tier, i) => sum + tier.price * (sold[i] ?? 0), 0);

  return tiers.map((tier, i) => {
    const tierSold = sold[i] ?? 0;
    const gross = value > 0 ? round2((event.gross_revenue * tier.price * tierSold) / value) : 0;
    return {
      tier_name: tier.name,
      tier_type: tier.tier_type,
      sold: tierSold,
      quota: tierSold + tier.available_quota,
      gross,
      share_percent: event.gross_revenue > 0 ? Math.round((gross / event.gross_revenue) * 100) : 0,
    };
  });
}

function arrivals(event: OrganizerEvent) {
  const sessions = getEventSessions(event.id).filter((session) => ARRIVALS[session.id]);
  if (sessions.length === 0) return null;
  const slots = ["−2:00", "−1:45", "−1:30", "−1:15", "−1:00", "−0:45", "−0:30", "−0:15", "Start", "+0:15", "+0:30", "+0:45"];
  const rows = sessions.map((session) => ({ session_id: session.id, name: session.name, counts: ARRIVALS[session.id] }));
  return { slots, sessions: rows, max: Math.max(...rows.flatMap((row) => row.counts)) };
}

export function getEventAnalytics(event: OrganizerEvent): EventAnalytics {
  const daily = dailySales(event);
  return EventAnalyticsSchema.parse({
    daily,
    window_tickets: daily.reduce((sum, day) => sum + day.tickets, 0),
    window_gross: round2(daily.reduce((sum, day) => sum + day.gross, 0)),
    tiers: tierSales(event),
    arrivals: arrivals(event),
  });
}
