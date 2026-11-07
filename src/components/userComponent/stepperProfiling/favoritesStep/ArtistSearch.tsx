import { Search, X } from "lucide-react";

interface ArtistSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ArtistSearch({ value, onChange }: ArtistSearchProps) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-[10px] border border-text-primary/12 bg-bg-surface-2 px-4 transition-colors focus-within:border-accent-pink focus-within:ring-1 focus-within:ring-accent-pink">
      <Search className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search artists or bands"
        aria-label="Search artists or bands"
        className="min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="shrink-0 cursor-pointer rounded-sm text-text-primary outline-none hover:text-accent-lime focus-visible:ring-2 focus-visible:ring-accent-pink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </label>
  );
}
