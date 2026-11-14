import Image from "next/image";
import Link from "next/link";
import type { ConcertEvent } from "@/types/event";

type CityTile = { city: string; count: number; image: string };

export function cityTilesFrom(events: ConcertEvent[]): CityTile[] {
  const byCity = Map.groupBy(events, (event) => event.venue.city);
  return [...byCity.entries()]
    .map(([city, cityEvents]) => ({ city, count: cityEvents.length, image: cityEvents[0]?.poster_url ?? "" }))
    .toSorted((a, b) => b.count - a.count || a.city.localeCompare(b.city));
}

export function CityTiles({ tiles }: { tiles: CityTile[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((tile) => (
        <li key={tile.city}>
          <Link
            href={`/events?city=${encodeURIComponent(tile.city)}`}
            className="group relative block aspect-square overflow-hidden rounded-[20px] bg-bg-surface outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
          >
            <Image
              src={tile.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-70 transition-[opacity,transform] duration-500 group-hover:scale-[1.03] group-hover:opacity-90 motion-reduce:transition-none"
            />
            <div className="absolute inset-x-2 bottom-2 rounded-xl bg-bg-base/80 px-3 py-2 backdrop-blur-sm">
              <p className="font-heading font-semibold">{tile.city}</p>
              <p className="text-xs text-text-muted">
                {tile.count} {tile.count === 1 ? "event" : "events"}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
