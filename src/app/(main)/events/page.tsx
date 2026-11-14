import { EVENTS } from "@/__fixtures__/events";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { EventCatalog } from "@/components/userComponent/eventCatalog/eventCatalog";
import { ALL_CITIES, DEFAULT_FILTERS } from "@/components/userComponent/eventCatalog/filterEvents";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const events = EVENTS.filter((event) => event.status === "published");
  const cities = [...new Set(events.map((event) => event.venue.city))].toSorted();
  const genres = [...new Set(events.flatMap((event) => event.categories))].toSorted();

  // ?city= and ?genre= come from the home page shortcuts; unknown values are ignored.
  const query = await searchParams;
  const city = param(query, "city");
  const genre = param(query, "genre");
  const initialFilters = {
    ...DEFAULT_FILTERS,
    city: city && cities.includes(city) ? city : ALL_CITIES,
    genres: genre && genres.includes(genre) ? [genre] : [],
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Explore" title="All events" description="Concerts and festivals with tickets on sale now." />
      <EventCatalog events={events} cities={cities} genres={genres} initialFilters={initialFilters} />
    </div>
  );
}
