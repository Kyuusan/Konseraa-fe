import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Seat, TicketTier, VenueLayout } from "@/types/event";

// One look per section, front of house first. Lime and pink are the brand accents;
// later sections use softer versions of them.
const LOOKS = [
  { block: "bg-accent-lime text-bg-base", dot: "bg-bg-base/55", swatch: "bg-accent-lime" },
  { block: "bg-accent-pink text-bg-base", dot: "bg-bg-base/55", swatch: "bg-accent-pink" },
  { block: "bg-accent-lime/35 text-text-primary", dot: "bg-text-primary/60", swatch: "bg-accent-lime/35" },
  { block: "bg-accent-pink/35 text-text-primary", dot: "bg-text-primary/60", swatch: "bg-accent-pink/35" },
];

type MapTier = Pick<TicketTier, "name" | "price" | "venue_section_id">;

interface SectionMapProps {
  layout: VenueLayout;
  tiers: MapTier[];
  /** "full" draws bigger seats and labels (dialog); "compact" fits a column. */
  size?: "compact" | "full";
  className?: string;
}

/** Seats placed by their coords inside the section (row = coord_y, seat = coord_x). */
function SeatGrid({ seats, dotClass, size }: { seats: Seat[]; dotClass: string; size: "compact" | "full" }) {
  const placed = seats.map((seat, index) => ({ seat, x: seat.coord_x ?? index + 1, y: seat.coord_y ?? 1 }));
  const columns = Math.max(...placed.map((item) => item.x));

  return (
    <div
      aria-hidden="true"
      className={cn("mx-auto grid w-full", size === "full" ? "max-w-xl gap-1" : "max-w-sm gap-0.5")}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {placed.map(({ seat, x, y }) => (
        <span
          key={seat.id}
          title={`Row ${seat.row_label}, seat ${seat.seat_number}`}
          className={cn("aspect-square rounded-full", dotClass)}
          style={{ gridColumn: x, gridRow: y }}
        />
      ))}
    </div>
  );
}

// Draws the venue from venue_sections + seats (backend models): there is no seat map image.
export function SectionMap({ layout, tiers, size = "compact", className }: SectionMapProps) {
  const sections = layout.sections.map((section, index) => ({
    section,
    look: LOOKS[index % LOOKS.length],
    seats: layout.seats.filter((seat) => seat.venue_section_id === section.id),
    tiers: tiers.filter((tier) => tier.venue_section_id === section.id),
  }));
  const tierLabel = (items: MapTier[]) => items.map((tier) => `${tier.name} ${formatPrice(tier.price)}`).join(" · ");

  return (
    <figure className={cn("space-y-4", className)}>
      <div className="space-y-2" role="img" aria-label={`Venue layout: stage, then ${sections.map(({ section }) => section.name).join(", ")}`}>
        <p className="mx-auto w-3/5 rounded-xl bg-bg-surface-2 py-2 text-center text-xs font-semibold tracking-[0.3em] text-text-primary/80">
          STAGE
        </p>
        {sections.map(({ section, look, seats, tiers: sectionTiers }) => (
          <div
            key={section.id}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl px-3 text-center",
              size === "full" ? "py-5" : "py-3",
              !section.is_seated && (size === "full" ? "min-h-28" : "min-h-16"),
              look.block,
            )}
          >
            <span className={cn("font-heading font-bold", size === "full" ? "text-lg" : "text-sm")}>{section.name}</span>
            {size === "full" && sectionTiers.length > 0 && <span className="text-xs font-medium">{tierLabel(sectionTiers)}</span>}
            {section.is_seated && seats.length > 0 && <SeatGrid seats={seats} dotClass={look.dot} size={size} />}
          </div>
        ))}
      </div>

      <figcaption>
        <ul className="space-y-2 text-sm">
          {sections.map(({ section, look, tiers: sectionTiers }) => (
            <li key={section.id} className="flex items-start gap-3">
              <span aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0 rounded", look.swatch)} />
              <span className="min-w-0">
                <span className="font-semibold">{section.name}</span>
                <span className="text-text-primary/70">
                  {" "}
                  · {section.is_seated ? `Seated, ${formatNumber(section.capacity)} seats` : `Standing, ${formatNumber(section.capacity)} people`}
                </span>
                {sectionTiers.length > 0 && <span className="block text-xs text-text-primary/70">{tierLabel(sectionTiers)}</span>}
              </span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
