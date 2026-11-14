"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChipToggleGroup } from "../shared/chipToggleGroup";
import { DateRangePicker } from "../shared/dateRangePicker";
import { ALL_CITIES, CATALOG_SORTS, type CatalogFilters, DEFAULT_FILTERS, SORT_LABELS } from "./filterEvents";

interface CatalogFiltersProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  cities: string[];
  genres: string[];
}

const FIELD = "space-y-2";
const LABEL = "text-xs font-semibold tracking-widest text-text-muted uppercase";

export function CatalogFiltersForm({ filters, onChange, cities, genres }: CatalogFiltersProps) {
  const set = <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-6">
      <div className={FIELD}>
        <Label htmlFor="filter-sort" className={LABEL}>Sort by</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) => {
            const sort = CATALOG_SORTS.find((item) => item === value);
            if (sort) set("sort", sort);
          }}
        >
          <SelectTrigger id="filter-sort" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATALOG_SORTS.map((sort) => (
              <SelectItem key={sort} value={sort}>{SORT_LABELS[sort]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={FIELD}>
        <Label htmlFor="filter-city" className={LABEL}>City</Label>
        <Select value={filters.city} onValueChange={(value) => set("city", value)}>
          <SelectTrigger id="filter-city" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CITIES}>All cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className={FIELD}>
        <legend className={`${LABEL} mb-2`}>Genre</legend>
        <ChipToggleGroup
          label="Genre"
          size="sm"
          options={genres.map((genre) => ({ value: genre, label: genre }))}
          value={filters.genres}
          onChange={(value) => set("genres", value)}
        />
      </fieldset>

      <div className={FIELD}>
        <Label htmlFor="filter-dates" className={LABEL}>Date</Label>
        <DateRangePicker
          id="filter-dates"
          from={filters.dateFrom}
          to={filters.dateTo}
          onChange={({ from, to }) => onChange({ ...filters, dateFrom: from, dateTo: to })}
        />
      </div>

      <fieldset className={FIELD}>
        <legend className={`${LABEL} mb-2`}>Starting price (USD)</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" min={0} inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={filters.priceMin} onChange={(event) => set("priceMin", event.target.value)} />
          <Input type="number" min={0} inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={filters.priceMax} onChange={(event) => set("priceMax", event.target.value)} />
        </div>
      </fieldset>

      <Button variant="ghost" hoverScale={1} className="w-full rounded-full" onClick={() => onChange({ ...DEFAULT_FILTERS, query: filters.query })}>
        Reset filters
      </Button>
    </div>
  );
}
