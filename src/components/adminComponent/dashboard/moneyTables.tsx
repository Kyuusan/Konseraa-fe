import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { AdminTransaction, PayoutDue } from "@/types/admin";
import { ADMIN_TIME_ZONE } from "./reviewQueueCard";

export function PayoutsDueList({ payouts }: { payouts: PayoutDue[] }) {
  return (
    <section aria-labelledby="payouts-due-heading" className="space-y-3">
      <h2 id="payouts-due-heading" className="text-sm font-semibold">
        Payouts due
      </h2>
      <ul className="divide-y divide-text-primary/10 rounded-[20px] bg-bg-surface px-5">
        {payouts.map((payout) => (
          <li key={payout.id} className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{payout.organizer_name}</p>
              <p className="truncate text-xs text-text-primary/70">{payout.event_title}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums">{formatPrice(payout.net_amount)}</p>
              <p className="text-xs text-text-primary/70">
                {formatDateTime(payout.scheduled_for, ADMIN_TIME_ZONE, { day: "numeric", month: "short" })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TransactionsTable({ transactions }: { transactions: AdminTransaction[] }) {
  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Booking</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Event</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Platform fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.booking_code}>
              <TableCell className="font-medium tabular-nums">{transaction.booking_code}</TableCell>
              <TableCell>{transaction.buyer_name}</TableCell>
              <TableCell>
                <p className="max-w-56 truncate">{transaction.event_title}</p>
                <p className="text-xs text-text-primary/70">{transaction.organizer_name}</p>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{formatPrice(transaction.total_amount)}</TableCell>
              <TableCell className="text-right tabular-nums text-text-primary/80">{formatPrice(transaction.platform_fee_amount)}</TableCell>
              <TableCell>
                <StatusBadge status={transaction.status} />
              </TableCell>
              <TableCell className="text-right whitespace-nowrap text-text-primary/70">
                {formatDateTime(transaction.created_at, ADMIN_TIME_ZONE, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
