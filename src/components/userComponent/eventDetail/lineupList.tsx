import Image from "next/image";
import { formatDate } from "@/lib/format";
import type { EventSession } from "@/types/event";

export function LineupList({ sessions, timeZone }: { sessions: EventSession[]; timeZone: string }) {
  return (
    <div className="space-y-8">
      {sessions.map((session) => (
        <section key={session.id} aria-label={session.name} className="space-y-4">
          {sessions.length > 1 && (
            <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase">
              {session.name} · {formatDate(session.start_at, timeZone)}
            </h3>
          )}
          <ul className="grid gap-3 sm:grid-cols-2">
            {session.artists.map((artist) => (
              <li key={artist.id} className="flex items-center gap-4 rounded-2xl bg-bg-surface p-3">
                <Image src={artist.image_url} alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
                <span className="font-heading text-lg font-semibold">{artist.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
