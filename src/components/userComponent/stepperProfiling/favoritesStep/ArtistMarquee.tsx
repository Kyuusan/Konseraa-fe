"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { Artist } from "../data/music";
import { ArtistCard } from "./ArtistCard";
import { genreLabel } from "./ArtistMasonry";

const COLUMN_COUNT = 3;
const COLUMN_DURATIONS = ["42s", "54s", "48s"];
// Four copies per column; the animation moves by half (two copies), so the loop
// never runs out of cards even when a column holds only two artists.
const COPIES = 4;

interface ArtistMarqueeProps {
  artists: Artist[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function ArtistMarquee({ artists, selected, onToggle }: ArtistMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const columns = Array.from({ length: COLUMN_COUNT }, (_, column) =>
    artists.filter((_, index) => index % COLUMN_COUNT === column),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setPaused((current) => !current)}
        aria-pressed={paused}
        aria-label={paused ? "Play artist scroll" : "Pause artist scroll"}
        className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-text-primary/20 bg-bg-base/80 text-text-primary outline-none backdrop-blur-sm transition-colors hover:border-text-primary/50 focus-visible:ring-2 focus-visible:ring-accent-pink motion-reduce:hidden"
      >
        {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
      </button>

      <div
        data-lenis-prevent
        className="group grid h-115 grid-cols-3 gap-3 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] motion-reduce:overflow-y-auto motion-reduce:mask-none sm:h-145"
      >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            style={{ "--marquee-duration": COLUMN_DURATIONS[columnIndex] } as CSSProperties}
            className={cn(
              "animate-[marquee-y_var(--marquee-duration)_linear_infinite] group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none",
              columnIndex % 2 === 1 && "[animation-direction:reverse]",
              paused && "[animation-play-state:paused]",
            )}
          >
            {Array.from({ length: COPIES }, (_, copy) =>
              column.map((artist, index) => (
                <div
                  key={`${artist.id}-${copy}`}
                  // Repeats only exist for the loop; with reduced motion the column scrolls instead.
                  className={cn("pb-3", copy > 0 && "motion-reduce:hidden")}
                >
                  <ArtistCard
                    artist={artist}
                    genreLabel={genreLabel(artist.genre)}
                    index={index + columnIndex}
                    selected={selected.includes(artist.id)}
                    onToggle={onToggle}
                    decorative={copy > 0}
                  />
                </div>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
