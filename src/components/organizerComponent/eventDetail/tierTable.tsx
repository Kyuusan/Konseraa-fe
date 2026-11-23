import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { TIER_TYPE_LABELS } from "@/lib/constants";
import { formatNumber, formatPrice } from "@/lib/format";
import type { TicketTier } from "@/types/event";

export function TierTable({ tiers }: { tiers: TicketTier[] }) {
  if (tiers.length === 0) {
    return <p className="rounded-[20px] bg-bg-surface p-5 text-sm text-text-primary/70">No ticket tiers yet.</p>;
  }

  return (
    <div className="rounded-[20px] bg-bg-surface px-2 py-1">
      <Table className="min-w-120">
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Max per order</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-medium">{tier.name}</TableCell>
              <TableCell className="text-text-primary/70">{TIER_TYPE_LABELS[tier.tier_type]}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{formatPrice(tier.price)}</TableCell>
              <TableCell className="text-right tabular-nums">{tier.max_per_transaction}</TableCell>
              <TableCell className={tier.available_quota === 0 ? "text-right text-danger" : "text-right tabular-nums"}>
                {tier.available_quota === 0 ? "Sold out" : formatNumber(tier.available_quota)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
