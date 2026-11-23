import { EVENTS, getEventSessions } from "@/__fixtures__/events";
import { GATE_CLOSES_HOURS_AFTER, GATE_OPENS_HOURS_BEFORE } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/format";
import type { Gatekeeper } from "@/types/gatekeeper";

export interface GateSession {
  id: string;
  event_title: string;
  session_name: string;
  venue_name: string;
  time_zone: string;
  start_at: string;
  /** "Fri, 12 Dec 2026 · 8:00 PM WIB" in venue time. */
  when: string;
  gate_opens_at: string;
  gate_closes_at: string;
}

const HOUR = 60 * 60 * 1000;

/** Every session of the events this gatekeeper is assigned to, soonest first. */
export function getGateSessions(gatekeeper: Gatekeeper): GateSession[] {
  return EVENTS.filter((event) => gatekeeper.event_ids.includes(event.id))
    .flatMap((event) =>
      getEventSessions(event.id).map((session) => {
        const start = Date.parse(session.start_at);
        return {
          id: session.id,
          event_title: event.title,
          session_name: session.name,
          venue_name: event.venue.name,
          time_zone: event.venue.timezone,
          start_at: session.start_at,
          when: `${formatDate(session.start_at, event.venue.timezone)} · ${formatTime(session.start_at, event.venue.timezone)}`,
          gate_opens_at: new Date(start - GATE_OPENS_HOURS_BEFORE * HOUR).toISOString(),
          gate_closes_at: new Date(start + GATE_CLOSES_HOURS_AFTER * HOUR).toISOString(),
        };
      }),
    )
    .toSorted((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at));
}
