import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { OrganizerSale } from "@/types/organizer";

const TIME_ZONE = "Asia/Jakarta";

export function RecentSalesTable({ sales }: { sales: OrganizerSale[] }) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-bg-surface">
      <Table className="min-w-160">
        <TableHeader>
          <TableRow>
            <TableHead>Booking</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.booking_code}>
              <TableCell className="font-medium tabular-nums">{sale.booking_code}</TableCell>
              <TableCell>{sale.buyer_name}</TableCell>
              <TableCell className="max-w-48 truncate">{sale.event_title}</TableCell>
              <TableCell className="text-text-primary/70">{sale.tier_name}</TableCell>
              <TableCell className="text-right tabular-nums">{sale.quantity}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{formatPrice(sale.total_amount)}</TableCell>
              <TableCell className="text-right whitespace-nowrap text-text-primary/70">
                {formatDateTime(sale.paid_at, TIME_ZONE, { hour: "numeric", minute: "2-digit" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
