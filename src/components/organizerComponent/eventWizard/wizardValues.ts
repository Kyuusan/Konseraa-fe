import type { EventBasicsForm, EventSectionForm, EventSessionForm, EventTierForm, EventVenueForm } from "@/types/eventForm";
import type { EventSession, Seat, TicketTier, Venue, VenueLayout, VenueSection } from "@/types/event";
import type { OrganizerEvent } from "@/types/organizer";

export interface EventWizardValues {
  basics: EventBasicsForm;
  venue: EventVenueForm;
  /** Areas of the venue (venue_sections); they draw the seat map. */
  sections: EventSectionForm[];
  sessions: EventSessionForm[];
  tiers: EventTierForm[];
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
  section_key: "",
});

export const emptySection = (): EventSectionForm => ({
  key: crypto.randomUUID(),
  name: "",
  is_seated: false,
  capacity: "",
  rows: "",
  seats_per_row: "",
});

export function emptyValues(): EventWizardValues {
  return {
    basics: { title: "", description: "", categories: [], poster: null, banner: null },
    venue: { name: "", type: "indoor", city: "", address: "", timezone: "Asia/Jakarta", capacity: "", permit: null },
    sections: [],
    sessions: [emptySession()],
    tiers: [emptyTier()],
  };
}

const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const whole = (value: string) => (/^\d+$/.test(value) ? Number(value) : 0);

/** People an area holds: its capacity, or rows × seats when seated. */
export const sectionCapacity = (section: EventSectionForm) =>
  section.is_seated ? whole(section.rows) * whole(section.seats_per_row) : whole(section.capacity);

/**
 * What the backend would store for the areas: venue_sections plus generated seats
 * (row A, B…; seat 1, 2…; coords = seat, row). Used for the live seat map preview.
 */
export function layoutFromSections(sections: EventSectionForm[]): VenueLayout {
  const named = sections.filter((section) => section.name.trim() && sectionCapacity(section) > 0);
  const venueSections: VenueSection[] = named.map((section) => ({
    id: section.key,
    venue_id: "new-venue",
    name: section.name.trim(),
    capacity: sectionCapacity(section),
    is_seated: section.is_seated,
  }));
  const seats: Seat[] = named
    .filter((section) => section.is_seated)
    .flatMap((section) =>
      Array.from({ length: whole(section.rows) }, (_, row) =>
        Array.from({ length: whole(section.seats_per_row) }, (_, seat) => ({
          id: `${section.key}-${row}-${seat}`,
          venue_section_id: section.key,
          row_label: ROW_LETTERS[row] ?? `R${row + 1}`,
          seat_number: String(seat + 1),
          coord_x: seat + 1,
          coord_y: row + 1,
        })),
      ).flat(),
    );
  return { sections: venueSections, seats };
}

/** Tiers as the seat map needs them: name, price and the area they point to. */
export const mapTiersFromForm = (tiers: EventTierForm[]) =>
  tiers.map((tier) => ({ name: tier.name || "Unnamed tier", price: Number(tier.price) || 0, venue_section_id: tier.section_key || null }));

const datePart = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
const timePart = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));

/** Back from a stored layout to the area rows (rows × seats from the seats it has). */
function sectionsFromLayout(layout: VenueLayout): EventSectionForm[] {
  return layout.sections.map((section) => {
    const seats = layout.seats.filter((seat) => seat.venue_section_id === section.id);
    const rows = new Set(seats.map((seat) => seat.row_label)).size;
    return {
      key: section.id,
      name: section.name,
      is_seated: section.is_seated,
      capacity: section.is_seated ? "" : String(section.capacity),
      rows: section.is_seated ? String(rows) : "",
      seats_per_row: section.is_seated && rows > 0 ? String(Math.ceil(seats.length / rows)) : "",
    };
  });
}

/**
 * Prefills the wizard from a draft or a rejected event. The fixtures have no
 * address or permit, so those start empty; missing sessions/tiers get one blank row.
 */
export function valuesFromDraft(
  event: OrganizerEvent,
  sessions: EventSession[] = [],
  tiers: TicketTier[] = [],
  layout: VenueLayout = { sections: [], seats: [] },
): EventWizardValues {
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
    sections: sectionsFromLayout(layout),
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
            section_key: tier.venue_section_id ?? "",
          }))
        : empty.tiers,
  };
}
