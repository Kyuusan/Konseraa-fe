import { Search, X } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";

interface ArtistSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ArtistSearch({ value, onChange }: ArtistSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search artists or bands"
        aria-label="Search artists or bands"
        className="h-12 rounded-[10px] bg-bg-surface-2 pr-12 pl-11 text-base [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-sm"
          hoverScale={1}
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
        >
          <X />
        </Button>
      )}
    </div>
  );
}
