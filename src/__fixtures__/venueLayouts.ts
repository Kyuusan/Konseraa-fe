// Dummy venue layouts (backend models: venue_sections + seats). Sections are listed
// front of house first; seats carry their row/number and a position in the section.
import { VenueLayoutSchema, type VenueLayout } from "@/types/event";
import { fixtureId } from "./ids";

const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const sectionId = (n: number) => fixtureId(3000 + n);

let nextSeat = 40_000;

/** Seats for a seated section: rows of equal length, coords = (seat, row) inside the section. */
export function seatGrid(venueSectionId: string, rows: string[], seatsPerRow: number, idFor?: () => string) {
  return rows.flatMap((row_label, rowIndex) =>
    Array.from({ length: seatsPerRow }, (_, seatIndex) => ({
      id: idFor ? idFor() : fixtureId(nextSeat++),
      venue_section_id: venueSectionId,
      row_label,
      seat_number: String(seatIndex + 1),
      coord_x: seatIndex + 1,
      coord_y: rowIndex + 1,
    })),
  );
}

export const rowLabels = (count: number, prefix = "") =>
  Array.from({ length: count }, (_, i) => (prefix ? `${prefix}${i + 1}` : ROW_LETTERS[i] ?? `R${i + 1}`));

const section = (n: number, venue: number, name: string, capacity: number, is_seated: boolean) => ({
  id: sectionId(n), venue_id: fixtureId(venue), name, capacity, is_seated,
});

const LAYOUTS: Record<string, unknown> = {
  // Istora Senayan
  [fixtureId(101)]: {
    sections: [section(1, 101, "VIP Standing", 300, false), section(2, 101, "Festival", 1840, false)],
    seats: [],
  },
  // Lapangan Saparua
  [fixtureId(102)]: {
    sections: [section(11, 102, "VIP Deck", 320, false), section(12, 102, "Regular Field", 9000, false)],
    seats: [],
  },
  // Balai Pemuda
  [fixtureId(103)]: {
    sections: [section(21, 103, "Front Tables", 12, true), section(22, 103, "Hall", 112, true)],
    seats: [...seatGrid(sectionId(21), rowLabels(3, "T"), 4), ...seatGrid(sectionId(22), rowLabels(8), 14)],
  },
  // Tokyo Garden Theater
  [fixtureId(106)]: {
    sections: [section(31, 106, "Stalls", 128, true), section(32, 106, "Balcony", 100, true)],
    seats: [...seatGrid(sectionId(31), rowLabels(8), 16), ...seatGrid(sectionId(32), rowLabels(5), 20)],
  },
};

const PARSED = new Map(Object.entries(LAYOUTS).map(([venueId, raw]) => [venueId, VenueLayoutSchema.parse(raw)]));

/** GET a venue's sections and seats; empty when the venue has no layout yet. */
export const getVenueLayout = (venueId: string): VenueLayout => PARSED.get(venueId) ?? { sections: [], seats: [] };
