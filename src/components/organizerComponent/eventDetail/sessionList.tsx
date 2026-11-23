import { formatDate, formatTime } from "@/lib/format";
import type { EventSession } from "@/types/event";

export function SessionList({ sessions, timeZone }: { sessions: EventSession[]; timeZone: string }) {
  if (sessions.length === 0) {
    return <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">No sessions yet.</p>;
  }

  return (
    <ol className="divide-y divide-text-primary/10 rounded-[20px] bg-bg-surface">
      {sessions.map((session) => (
        <li key={session.id} className="grid gap-2 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
          <div className="min-w-0 space-y-1">
            <p className="font-heading text-lg font-semibold">{session.name}</p>
            <p className="truncate text-sm text-text-primary/70">
              {session.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
          <p className="text-sm sm:text-right">
            <span className="block font-semibold">{formatDate(session.start_at, timeZone)}</span>
            <span className="text-text-primary/70">
              {formatTime(session.start_at, timeZone)} – {formatTime(session.end_at, timeZone)}
            </span>
          </p>
        </li>
      ))}
    </ol>
  );
}
