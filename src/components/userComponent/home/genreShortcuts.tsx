import Link from "next/link";

export function GenreShortcuts({ genres }: { genres: string[] }) {
  return (
    <nav aria-label="Browse by genre" className="-mx-3 overflow-x-auto px-3 scrollbar-none sm:-mx-6 sm:px-6">
      <ul className="flex w-max gap-2">
        {genres.map((genre) => (
          <li key={genre}>
            <Link
              href={`/events?genre=${encodeURIComponent(genre)}`}
              className="flex h-10 items-center rounded-full border border-text-primary/15 px-5 text-sm font-semibold whitespace-nowrap transition-colors outline-none hover:border-accent-lime hover:text-accent-lime focus-visible:ring-2 focus-visible:ring-accent-pink"
            >
              {genre}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
