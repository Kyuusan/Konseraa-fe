import { ChipToggleGroup } from "../../shared/chipToggleGroup";
import type { Genre } from "../data/music";

interface GenreBadgeListProps {
  genres: Genre[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function GenreBadgeList({ genres, selected, onChange }: GenreBadgeListProps) {
  return (
    <ChipToggleGroup
      label="Genres"
      options={genres.map((genre) => ({ value: genre.id, label: genre.label }))}
      value={selected}
      onChange={onChange}
    />
  );
}
