import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Genre } from "../data/music";

interface GenreBadgeListProps {
  genres: Genre[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function GenreBadgeList({ genres, selected, onToggle }: GenreBadgeListProps) {
  return (
    <div role="group" aria-label="Genres" className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const isSelected = selected.includes(genre.id);
        return (
          <button
            key={genre.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(genre.id)}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
              isSelected
                ? "border-accent-lime bg-accent-lime text-bg-base"
                : "border-text-primary/20 text-text-primary hover:border-text-primary/50",
            )}
          >
            {isSelected && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
            {genre.label}
          </button>
        );
      })}
    </div>
  );
}
