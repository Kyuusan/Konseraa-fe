import { GENRES, type Artist } from "../data/music";
import { ArtistCard } from "./ArtistCard";

interface ArtistMasonryProps {
  artists: Artist[];
  selected: string[];
  onToggle: (id: string) => void;
  query: string;
}

export const genreLabel = (id: string) => GENRES.find((genre) => genre.id === id)?.label ?? id;

// Static masonry, used when there are too few artists for the marquee to loop.
export function ArtistMasonry({ artists, selected, onToggle, query }: ArtistMasonryProps) {
  if (artists.length === 0) {
    return (
      <p className="rounded-[16px] border border-dashed border-text-primary/20 px-4 py-10 text-center text-sm text-text-muted">
        No artists match &ldquo;{query}&rdquo;. Try another name.
      </p>
    );
  }

  return (
    <div className="columns-2 gap-3 sm:columns-3">
      {artists.map((artist, index) => (
        <div key={artist.id} className="mb-3 break-inside-avoid">
          <ArtistCard
            artist={artist}
            genreLabel={genreLabel(artist.genre)}
            index={index}
            selected={selected.includes(artist.id)}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
}
