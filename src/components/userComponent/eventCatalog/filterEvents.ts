import type { ConcertEvent, EventSort } from "@/types/event";

// Client-side stand-in for GET /events (city, date_from, date_to, genre,
// price_min, price_max, sort) and GET /events/search (q) while the catalogue is dummy data.

/** "popularity" is left out until real sales data exists. */
export const CATALOG_SORTS = ["newest", "price_asc", "price_desc"] as const satisfies readonly EventSort[];
export type CatalogSort = (typeof CATALOG_SORTS)[number];

export const SORT_LABELS: Record<CatalogSort, string> = {
  newest: "Newest",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};

export type CatalogFilters = {
  query: string;
  city: string;
  genres: string[];
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
  sort: CatalogSort;
};

export const ALL_CITIES = "all";

export const DEFAULT_FILTERS: CatalogFilters = {
  query: "",
  city: ALL_CITIES,
  genres: [],
  dateFrom: "",
  dateTo: "",
  priceMin: "",
  priceMax: "",
  sort: "newest",
};

const matchesQuery = (event: ConcertEvent, query: string) => {
  const needle = query.trim().toLowerCase();
  if (needle === "") return true;
  return [event.title, event.venue.name, event.venue.city, ...event.categories].some((text) =>
    text.toLowerCase().includes(needle),
  );
};

const toNumber = (value: string) => (value.trim() === "" ? null : Number(value));
/** starts_at carries the venue's offset, so its first 10 characters are the venue-local date. */
const localDate = (event: ConcertEvent) => event.starts_at.slice(0, 10);

export function countActiveFilters(filters: CatalogFilters) {
  return [
    filters.city !== ALL_CITIES,
    filters.genres.length > 0,
    filters.dateFrom !== "" || filters.dateTo !== "",
    filters.priceMin !== "" || filters.priceMax !== "",
  ].filter(Boolean).length;
}

export function filterEvents(events: ConcertEvent[], filters: CatalogFilters) {
  const min = toNumber(filters.priceMin);
  const max = toNumber(filters.priceMax);

  const matches = events.filter(
    (event) =>
      matchesQuery(event, filters.query) &&
      (filters.city === ALL_CITIES || event.venue.city === filters.city) &&
      (filters.genres.length === 0 || event.categories.some((genre) => filters.genres.includes(genre))) &&
      (filters.dateFrom === "" || localDate(event) >= filters.dateFrom) &&
      (filters.dateTo === "" || localDate(event) <= filters.dateTo) &&
      (min === null || event.min_price >= min) &&
      (max === null || event.min_price <= max),
  );

  switch (filters.sort) {
    case "price_asc":
      return matches.toSorted((a, b) => a.min_price - b.min_price);
    case "price_desc":
      return matches.toSorted((a, b) => b.min_price - a.min_price);
    case "newest":
      return matches;
  }
}
