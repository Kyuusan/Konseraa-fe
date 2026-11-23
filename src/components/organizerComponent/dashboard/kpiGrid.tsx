import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface KpiGridProps {
  grossRevenue: number;
  ticketsSold: number;
  monthGross: number;
  monthChangePercent: number;
}

export function KpiGrid({ grossRevenue, ticketsSold, monthGross, monthChangePercent }: KpiGridProps) {
  const up = monthChangePercent >= 0;
  const items = [
    { label: "Total gross sales", value: formatPrice(grossRevenue), note: "All events" },
    { label: "Tickets sold", value: formatNumber(ticketsSold), note: "All events" },
    {
      label: "This month",
      value: formatPrice(monthGross),
      note: `${up ? "+" : ""}${monthChangePercent}% vs last month`,
      tone: up ? "text-accent-lime" : "text-danger",
    },
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[20px] bg-bg-surface p-5">
          <dt className="text-sm font-semibold text-text-primary">{item.label}</dt>
          <dd className="mt-3 truncate font-heading text-2xl font-bold xl:text-3xl">{item.value}</dd>
          <dd className={cn("mt-1 text-xs", item.tone ?? "text-text-primary/70")}>{item.note}</dd>
        </div>
      ))}
    </dl>
  );
}
