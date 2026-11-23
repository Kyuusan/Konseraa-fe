import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Payout } from "@/types/payout";

const TIME_ZONE = "Asia/Jakarta";
const day = (iso: string) => formatDateTime(iso, TIME_ZONE, { day: "numeric", month: "short", year: "numeric" });

export function PayoutTable({ payouts }: { payouts: Payout[] }) {
  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead className="text-right">Gross</TableHead>
            <TableHead className="text-right">Platform fee</TableHead>
            <TableHead className="text-right">You receive</TableHead>
            <TableHead>Payout date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.map((payout) => (
            <TableRow key={payout.id}>
              <TableCell>
                <p className="max-w-56 truncate font-semibold">{payout.event_title}</p>
                <p className="text-xs text-text-primary/70">Ended {day(payout.event_ended_at)}</p>
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatPrice(payout.gross_amount)}</TableCell>
              <TableCell className="text-right tabular-nums text-text-primary/70">
                −{formatPrice(payout.commission_amount)}
                <span className="block text-xs">{payout.commission_rate_percent}%</span>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatPrice(payout.net_amount)}
                {payout.is_estimate && <span className="block text-xs font-normal text-text-primary/70">Estimate, sales open</span>}
              </TableCell>
              <TableCell className="whitespace-nowrap text-text-primary/80">
                {payout.paid_at ? day(payout.paid_at) : day(payout.scheduled_for)}
              </TableCell>
              <TableCell>
                <StatusBadge status={payout.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
