import { Progress } from "@/components/animate-ui/components/radix/progress";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SalesProgressProps {
  sold: number;
  capacity: number;
  className?: string;
}

export function SalesProgress({ sold, capacity, className }: SalesProgressProps) {
  const percent = capacity > 0 ? Math.round((sold / capacity) * 100) : 0;

  return (
    <div className={cn("min-w-36 space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span>
          <span className="font-semibold">{formatNumber(sold)}</span>
          <span className="text-text-primary/70"> / {formatNumber(capacity)}</span>
        </span>
        <span className="text-text-primary/70">{percent}%</span>
      </div>
      <Progress value={percent} aria-label={`${percent}% of tickets sold`} className="h-1.5" />
    </div>
  );
}
