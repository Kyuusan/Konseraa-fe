/* eslint-disable @next/next/no-img-element */
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Artist } from "../data/music";

// Varying heights are what make the masonry columns stagger.
const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"];

interface ArtistCardProps {
  artist: Artist;
  genreLabel: string;
  index: number;
  selected: boolean;
  onToggle: (id: string) => void;
  /** A visual repeat for the marquee loop: still clickable, but skipped by keyboard and screen readers. */
  decorative?: boolean;
}

export function ArtistCard({
  artist,
  genreLabel,
  index,
  selected,
  onToggle,
  decorative,
}: ArtistCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      onClick={() => onToggle(artist.id)}
      className={cn(
        "group/card relative block w-full cursor-pointer overflow-hidden rounded-[16px] bg-bg-surface-2 text-left outline-none ring-2 transition-shadow focus-visible:ring-accent-pink",
        ASPECTS[index % ASPECTS.length],
        selected ? "ring-accent-lime" : "ring-transparent",
      )}
    >
      <img
        src={artist.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
      />
      <span className="absolute inset-0 bg-linear-to-t from-bg-base/95 via-bg-base/30 to-transparent" />

      {selected && (
        <span className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-accent-lime text-bg-base">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        </span>
      )}

      <span className="absolute inset-x-3 bottom-3 block">
        <span className="block truncate font-heading text-sm font-semibold text-text-primary sm:text-base">
          {artist.name}
        </span>
        <span className="block text-xs font-medium text-text-primary/80">{genreLabel}</span>
      </span>
    </button>
  );
}
