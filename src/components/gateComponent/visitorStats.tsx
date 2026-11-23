import { ProgressRing } from "@/components/organizerComponent/shared/progressRing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { CheckIn, CheckInStats } from "@/types/gatekeeper";

const percentOf = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

export function VisitorSummary({ stats }: { stats: CheckInStats }) {
  const outside = Math.max(0, stats.tickets_sold - stats.checked_in);

  return (
    <div className="grid gap-3 sm:grid-cols-[auto_1fr_1fr]">
      <div className="flex items-center gap-5 rounded-[20px] bg-bg-surface p-5">
        <ProgressRing percent={percentOf(stats.checked_in, stats.tickets_sold)} label="checked in" />
        <div>
          <p className="text-sm font-semibold">Checked in</p>
          <p className="font-heading text-3xl font-bold">{formatNumber(stats.checked_in)}</p>
          <p className="text-xs text-text-primary/70">of {formatNumber(stats.tickets_sold)} tickets sold</p>
        </div>
      </div>
      <div className="rounded-[20px] bg-bg-surface p-5">
        <p className="text-sm font-semibold">Not arrived yet</p>
        <p className="mt-3 font-heading text-3xl font-bold">{formatNumber(outside)}</p>
      </div>
      <div className="rounded-[20px] bg-bg-surface p-5">
        <p className="text-sm font-semibold">Repeat scans</p>
        <p className="mt-3 font-heading text-3xl font-bold">{formatNumber(stats.duplicates)}</p>
        <p className="mt-1 text-xs text-text-primary/70">Tickets shown again after entry</p>
      </div>
    </div>
  );
}

export function TierAttendanceTable({ stats }: { stats: CheckInStats }) {
  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-120">
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Checked in</TableHead>
            <TableHead className="text-right">Sold</TableHead>
            <TableHead className="text-right">Arrived</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.by_tier.map((tier) => (
            <TableRow key={tier.tier_name}>
              <TableCell className="font-medium">{tier.tier_name}</TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(tier.checked_in)}</TableCell>
              <TableCell className="text-right tabular-nums text-text-primary/70">{formatNumber(tier.sold)}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{percentOf(tier.checked_in, tier.sold)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ScanLogTable({ logs, timeZone }: { logs: CheckIn[]; timeZone: string }) {
  if (logs.length === 0) {
    return <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">No scans yet for this session.</p>;
  }

  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-160">
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Ticket</TableHead>
            <TableHead>Holder</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap text-text-primary/70">
                {formatDateTime(log.scanned_at, timeZone, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
                {log.is_offline_sync && <span className="block text-xs">Synced later</span>}
              </TableCell>
              <TableCell className="font-mono font-semibold">{log.ticket_code ?? "Unreadable"}</TableCell>
              <TableCell>{log.holder_name ?? "—"}</TableCell>
              <TableCell className="text-text-primary/70">{log.tier_name ?? "—"}</TableCell>
              <TableCell>
                <StatusBadge status={log.result} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
