import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";
import type { Artist } from "../data/music";

// Varying heights are what make the masonry columns stagger.
const ASPECTS = ["aspect-3/4", "aspect-square", "aspect-4/5"];

interface ArtistCardProps {
  artist: Artist;
  genreLabel: string;
  index: number;
  selected: boolean;
  onToggle: (id: string) => void;
  /** A visual repeat for the marquee loop: still clickable, but skipped by keyboard and screen readers. */
  decorative?: boolean;
}

export function ArtistCard({ artist, genreLabel, index, selected, onToggle, decorative }: ArtistCardProps) {
  return (
    <Button
      variant="ghost"
      hoverScale={1}
      tapScale={0.98}
      aria-pressed={selected}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      onClick={() => onToggle(artist.id)}
      className={cn(
        "group/card relative block h-auto w-full overflow-hidden rounded-2xl bg-bg-surface-2 p-0 text-left whitespace-normal ring-2 transition-shadow hover:bg-bg-surface-2 focus-visible:ring-accent-pink",
        ASPECTS[index % ASPECTS.length],
        selected ? "ring-accent-lime" : "ring-transparent",
      )}
    >
      <Image
        src={artist.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 15vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
      />

      {selected && (
        <span className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-accent-lime text-bg-base">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        </span>
      )}

      <span className="absolute inset-x-2 bottom-2 block rounded-xl bg-bg-base/80 px-3 py-2 backdrop-blur-sm">
        <span className="block truncate font-heading text-sm font-semibold text-text-primary sm:text-base">
          {artist.name}
        </span>
        <span className="block text-xs font-medium text-text-muted">{genreLabel}</span>
      </span>
    </Button>
  );
}
