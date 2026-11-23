import Link from "next/link";
import { cn } from "@/lib/utils";

type StatusTile = { value: string; label: string; count: number };

// Event counts per review stage; each tile opens that tab in My events.
export function StatusStrip({ tiles }: { tiles: StatusTile[] }) {
  return (
    <section aria-labelledby="status-strip-heading" className="space-y-4 rounded-[20px] bg-bg-surface p-6">
      <h2 id="status-strip-heading" className="text-sm font-semibold text-text-primary">Events by status</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {tiles.map((tile, index) => (
          <li key={tile.value}>
            <Link
              href={`/organizer/events?status=${tile.value}`}
              className={cn(
                "flex h-full flex-col justify-between gap-6 rounded-2xl p-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-pink",
                index === 0 ? "bg-accent-lime text-bg-base hover:bg-accent-lime/90" : "bg-bg-surface-2 hover:bg-bg-surface-2/70",
              )}
            >
              <span className="font-heading text-3xl font-bold">{tile.count}</span>
              <span className={cn("text-sm font-semibold", index === 0 ? "text-bg-base" : "text-text-primary/80")}>{tile.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
