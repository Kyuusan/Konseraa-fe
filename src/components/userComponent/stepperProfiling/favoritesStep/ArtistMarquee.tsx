"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
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
      <Button
        variant="outline"
        size="icon"
        hoverScale={1}
        onClick={() => setPaused((current) => !current)}
        aria-pressed={paused}
        aria-label={paused ? "Play artist scroll" : "Pause artist scroll"}
        className="absolute top-3 right-3 z-10 size-10 rounded-full bg-bg-base/80 backdrop-blur-sm motion-reduce:hidden"
      >
        {paused ? <Play /> : <Pause />}
      </Button>

      <div
        data-lenis-prevent
        className="group grid h-115 grid-cols-3 gap-3 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] motion-reduce:overflow-y-auto motion-reduce:mask-none sm:h-145"
      >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            style={{ "--marquee-duration": COLUMN_DURATIONS[columnIndex] } as CSSProperties}
            className={cn(
              "animate-[marquee-y_var(--marquee-duration)_linear_infinite] group-focus-within:paused group-hover:paused motion-reduce:animate-none",
              columnIndex % 2 === 1 && "[animation-direction:reverse]",
              paused && "paused",
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
