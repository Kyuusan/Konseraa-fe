"use client";

import { useState } from "react";
import { ARTISTS, GENRES } from "../data/music";
import { ArtistMarquee } from "./ArtistMarquee";
import { ArtistMasonry } from "./ArtistMasonry";
import { ArtistSearch } from "./ArtistSearch";
import { GenreBadgeList } from "./GenreBadgeList";

const MAX_VISIBLE_ARTISTS = 10;
// Below this the marquee columns would be too short to loop nicely.
const MIN_ARTISTS_FOR_MARQUEE = 6;

interface FavoritesStepProps {
  genres: string[];
  onGenresChange: (genres: string[]) => void;
  artists: string[];
  onArtistsChange: (artists: string[]) => void;
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

export function FavoritesStep({
  genres,
  onGenresChange,
  artists,
  onArtistsChange,
}: FavoritesStepProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  // Search looks through every artist; otherwise the picked genres narrow the list.
  const visibleArtists = ARTISTS.filter((artist) =>
    normalizedQuery
      ? artist.name.toLowerCase().includes(normalizedQuery)
      : genres.length === 0 || genres.includes(artist.genre),
  ).slice(0, MAX_VISIBLE_ARTISTS);

  const toggleArtist = (id: string) => onArtistsChange(toggle(artists, id));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
      <section className="space-y-4 lg:sticky lg:top-10 lg:self-start">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold">Genres</h3>
          <span className="text-sm text-text-muted">{genres.length} selected</span>
        </div>
        <p className="text-sm text-text-muted">
          Pick the genres you love. The artists on the right follow your picks.
        </p>
        <GenreBadgeList
          genres={GENRES}
          selected={genres}
          onChange={onGenresChange}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold">Favorite artists</h3>
          <span className="text-sm text-text-muted">{artists.length} selected</span>
        </div>
        <ArtistSearch value={query} onChange={setQuery} />
        <p className="text-sm text-text-muted">
          Showing up to {MAX_VISIBLE_ARTISTS} artists. Search to find someone who isn&apos;t listed.
        </p>
        {visibleArtists.length >= MIN_ARTISTS_FOR_MARQUEE ? (
          <ArtistMarquee artists={visibleArtists} selected={artists} onToggle={toggleArtist} />
        ) : (
          <ArtistMasonry
            artists={visibleArtists}
            selected={artists}
            onToggle={toggleArtist}
            query={query}
          />
        )}
      </section>
    </div>
  );
}
