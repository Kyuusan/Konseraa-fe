import type { EventBasicsForm, EventSessionForm, EventTierForm, EventVenueForm } from "@/types/eventForm";
import type { EventSession, TicketTier, Venue } from "@/types/event";
import type { DocumentFile, OrganizerEvent } from "@/types/organizer";

/** Optional seat map: the file's metadata plus a URL to preview it. */
export interface SeatMapUpload {
  file: DocumentFile;
  previewUrl: string;
}

export interface EventWizardValues {
  basics: EventBasicsForm;
  venue: EventVenueForm;
  sessions: EventSessionForm[];
  tiers: EventTierForm[];
  seatMap: SeatMapUpload | null;
}

/** Venue zones offered in the wizard (IANA ids). */
export const TIMEZONES = [
  { value: "Asia/Jakarta", label: "Jakarta (WIB, UTC+7)" },
  { value: "Asia/Makassar", label: "Makassar (WITA, UTC+8)" },
  { value: "Asia/Jayapura", label: "Jayapura (WIT, UTC+9)" },
  { value: "Asia/Singapore", label: "Singapore (UTC+8)" },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)" },
  { value: "Asia/Seoul", label: "Seoul (UTC+9)" },
];

export const VENUE_TYPE_LABELS: Record<Venue["type"], string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  hybrid: "Indoor and outdoor",
};

export const emptySession = (): EventSessionForm => ({
  key: crypto.randomUUID(),
  name: "",
  date: "",
  start: "",
  end: "",
  lineup: "",
});

export const emptyTier = (): EventTierForm => ({
  key: crypto.randomUUID(),
  name: "",
  tier_type: "regular",
  price: "",
  quota: "",
  max_per_transaction: "4",
});

export function emptyValues(): EventWizardValues {
  return {
    basics: { title: "", description: "", categories: [], poster: null, banner: null },
    venue: { name: "", type: "indoor", city: "", address: "", timezone: "Asia/Jakarta", capacity: "", permit: null },
    sessions: [emptySession()],
    tiers: [emptyTier()],
    seatMap: null,
  };
}

const datePart = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
const timePart = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));

/**
 * Prefills the wizard from a draft or a rejected event. The fixtures have no
 * address or permit, so those start empty; missing sessions/tiers get one blank row.
 */
export function valuesFromDraft(event: OrganizerEvent, sessions: EventSession[] = [], tiers: TicketTier[] = []): EventWizardValues {
  const { timezone } = event.venue;
  const empty = emptyValues();
  return {
    basics: {
      title: event.title,
      description: event.description,
      categories: event.categories,
      poster: { name: "Poster saved in this draft", size: 0, mime_type: "image/jpeg" },
      banner: { name: "Banner saved in this draft", size: 0, mime_type: "image/jpeg" },
    },
    venue: {
      ...empty.venue,
      name: event.venue.name,
      type: event.venue.type,
      city: event.venue.city,
      timezone,
      capacity: String(event.venue.total_capacity),
    },
    sessions:
      sessions.length > 0
        ? sessions.map((session) => ({
            key: session.id,
            name: session.name,
            date: datePart(session.start_at, timezone),
            start: timePart(session.start_at, timezone),
            end: timePart(session.end_at, timezone),
            lineup: session.artists.map((artist) => artist.name).join(", "),
          }))
        : [{ ...emptySession(), name: "Main show", date: datePart(event.starts_at, timezone), start: timePart(event.starts_at, timezone) }],
    tiers:
      tiers.length > 0
        ? tiers.map((tier) => ({
            key: tier.id,
            name: tier.name,
            tier_type: tier.tier_type,
            price: String(tier.price),
            quota: String(tier.available_quota),
            max_per_transaction: String(tier.max_per_transaction),
          }))
        : empty.tiers,
    seatMap: event.seat_map_url
      ? { file: { name: "Seat map saved in this draft", size: 0, mime_type: "image/svg+xml" }, previewUrl: event.seat_map_url }
      : null,
  };
}
