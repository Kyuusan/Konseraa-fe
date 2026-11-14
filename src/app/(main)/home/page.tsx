import { EVENTS, FAVORITE_GENRES, getEventBySlug, getFeaturedEvents } from "@/__fixtures__/events";
import { EventCard } from "@/components/userComponent/eventCatalog/eventCard";
import { FeaturedRow } from "@/components/userComponent/eventCatalog/featuredRow";
import { CityTiles, cityTilesFrom } from "@/components/userComponent/home/cityTiles";
import { GenreShortcuts } from "@/components/userComponent/home/genreShortcuts";
import { HeroBanners } from "@/components/userComponent/home/heroBanners";
import { SectionHeader } from "@/components/userComponent/home/sectionHeader";

/** Hand-picked banner events; static until banners are managed from the admin side. */
const HERO_MAIN_SLUG = "seoul-afterglow";
const HERO_SECONDARY_SLUG = "bass-assembly-nye";
const SOON_COUNT = 4;

export default function Page() {
  const upcoming = EVENTS.filter((event) => event.status === "published");
  const soonest = upcoming.toSorted((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at)).slice(0, SOON_COUNT);
  const recommended = upcoming.filter((event) => event.categories.some((genre) => FAVORITE_GENRES.includes(genre)));
  const genres = [...new Set(upcoming.flatMap((event) => event.categories))].toSorted();
  const heroMain = getEventBySlug(HERO_MAIN_SLUG);
  const heroSecondary = getEventBySlug(HERO_SECONDARY_SLUG);

  return (
    <div className="space-y-14 pt-4">
      {heroMain && heroSecondary && <HeroBanners main={heroMain} secondary={heroSecondary} />}

      <GenreShortcuts genres={genres} />

      <section aria-labelledby="featured-heading" className="space-y-5">
        <SectionHeader id="featured-heading" title="Featured events" href="/events" />
        <FeaturedRow events={getFeaturedEvents()} />
      </section>

      <section aria-labelledby="soon-heading" className="space-y-5">
        <SectionHeader id="soon-heading" title="Happening soon" description="The next shows on the calendar." href="/events" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {soonest.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section aria-labelledby="cities-heading" className="space-y-5">
        <SectionHeader id="cities-heading" title="Browse by city" />
        <CityTiles tiles={cityTilesFrom(upcoming)} />
      </section>

      <section aria-labelledby="recommended-heading" className="space-y-5">
        <SectionHeader
          id="recommended-heading"
          title="Recommended for you"
          description={`Based on your favourite genres: ${FAVORITE_GENRES.join(", ")}.`}
          href="/events"
          linkLabel="Browse all events"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {recommended.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
