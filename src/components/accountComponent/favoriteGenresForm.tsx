"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ChipToggleGroup } from "@/components/userComponent/shared/chipToggleGroup";
import { FavoriteGenresSchema } from "@/types/user";

interface FavoriteGenresFormProps {
  genres: string[];
  initial: string[];
}

// Stands in for PUT /users/me/preferences { favorite_genres } (in spec).
export function FavoriteGenresForm({ genres, initial }: FavoriteGenresFormProps) {
  const [selected, setSelected] = useState(initial);
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState(false);

  function save() {
    const result = FavoriteGenresSchema.safeParse({ favorite_genres: selected });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <ChipToggleGroup
        label="Favourite genres"
        size="sm"
        options={genres.map((genre) => ({ value: genre, label: genre }))}
        value={selected}
        onChange={(next) => {
          setSelected(next);
          setSaved(false);
          setError(undefined);
        }}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-primary/70">{selected.length} of 10 picked</p>
        <div className="flex items-center gap-3">
          <p role="status" className="text-sm text-accent-lime">
            {saved && "Saved. Home recommendations follow these genres."}
          </p>
          <Button hoverScale={1.02} onClick={save} className="h-11 rounded-full px-6 font-semibold">
            Save genres
          </Button>
        </div>
      </div>
    </div>
  );
}
