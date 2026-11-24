import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { formatNumber } from "@/lib/format";
import type { Arrivals } from "@/types/analytics";

// Lime at a strength that follows the count; the number stays readable on top.
const cellColor = (count: number, max: number) =>
  `color-mix(in oklab, var(--color-accent-lime) ${max > 0 ? Math.round(8 + (count / max) * 82) : 0}%, var(--color-bg-surface-2))`;

export function ArrivalsHeatmap({ arrivals }: { arrivals: Arrivals }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[20px] bg-bg-surface">
        <Table className="min-w-200">
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              {arrivals.slots.map((slot) => (
                <TableHead key={slot} className="px-1 text-center text-xs">
                  {slot}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {arrivals.sessions.map((session) => (
              <TableRow key={session.session_id} className="hover:bg-transparent">
                <TableCell className="font-semibold">{session.name}</TableCell>
                {session.counts.map((count, i) => {
                  const strong = count / Math.max(1, arrivals.max) > 0.55;
                  return (
                    <TableCell key={arrivals.slots[i]} className="p-1">
                      <span
                        title={`${arrivals.slots[i]}: ${formatNumber(count)} check-ins`}
                        className={`flex h-11 items-center justify-center rounded-lg text-xs font-semibold tabular-nums ${strong ? "text-bg-base" : "text-text-primary"}`}
                        style={{ backgroundColor: cellColor(count, arrivals.max) }}
                      >
                        {formatNumber(count)}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-text-primary/70">
        Check-ins per 15 minutes, counted from the gate opening (2 hours before the start) until it closes.
      </p>
    </div>
  );
}
