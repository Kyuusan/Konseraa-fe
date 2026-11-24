import type { TicketTier, VenueLayout } from "@/types/event";
import { SeatMapPreview } from "./seatMapPreview";
import { SectionMap } from "./sectionMap";

interface VenueSeatMapProps {
  layout: VenueLayout;
  tiers: Pick<TicketTier, "name" | "price" | "venue_section_id">[];
  eventTitle: string;
  variant?: "card" | "inline";
  description?: string;
  className?: string;
}

/** The seat map preview, drawn from the venue's sections and seats. Nothing when the venue has none. */
export function VenueSeatMap({ layout, tiers, eventTitle, variant = "card", description, className }: VenueSeatMapProps) {
  if (layout.sections.length === 0) return null;

  return (
    <SeatMapPreview
      eventTitle={eventTitle}
      variant={variant}
      description={description}
      className={className}
      map={variant === "inline" ? <SectionMap layout={layout} tiers={tiers} /> : undefined}
      fullMap={<SectionMap layout={layout} tiers={tiers} size="full" />}
    />
  );
}
