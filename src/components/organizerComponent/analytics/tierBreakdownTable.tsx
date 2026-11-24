import { Progress } from "@/components/animate-ui/components/radix/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tableBase";
import { TIER_TYPE_LABELS } from "@/lib/constants";
import { formatNumber, formatPrice } from "@/lib/format";
import type { TierSales } from "@/types/analytics";

export function TierBreakdownTable({ tiers }: { tiers: TierSales[] }) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-bg-surface">
      <Table className="min-w-160">
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead className="text-right">Gross</TableHead>
            <TableHead className="text-right">Share of gross</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => {
            const percent = tier.quota > 0 ? Math.round((tier.sold / tier.quota) * 100) : 0;
            return (
              <TableRow key={tier.tier_name}>
                <TableCell>
                  <p className="font-semibold">{tier.tier_name}</p>
                  <p className="text-xs text-text-primary/70">{TIER_TYPE_LABELS[tier.tier_type]}</p>
                </TableCell>
                <TableCell>
                  <div className="w-48 space-y-1.5">
                    <p className="text-xs">
                      <span className="font-semibold">{formatNumber(tier.sold)}</span>
                      <span className="text-text-primary/70"> / {formatNumber(tier.quota)}</span>
                    </p>
                    <Progress value={percent} aria-label={`${percent}% of ${tier.tier_name} sold`} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatPrice(tier.gross)}</TableCell>
                <TableCell className="text-right tabular-nums">{tier.share_percent}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
