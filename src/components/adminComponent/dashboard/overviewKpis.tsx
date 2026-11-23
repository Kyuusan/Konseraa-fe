import { formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminOverview } from "@/types/admin";

export function OverviewKpis({ overview }: { overview: AdminOverview }) {
  const up = overview.month_change_percent >= 0;
  const items = [
    {
      label: "Gross sales",
      value: formatPrice(overview.month_gross),
      note: `${up ? "+" : ""}${overview.month_change_percent}% vs last month`,
      tone: up ? "text-accent-lime" : "text-danger",
    },
    { label: "Platform fees", value: formatPrice(overview.month_platform_fees), note: "Collected this month" },
    { label: "Tickets sold", value: formatNumber(overview.month_tickets), note: "This month" },
    {
      label: "Live events",
      value: formatNumber(overview.active_events),
      note: `From ${formatNumber(overview.active_organizers)} organizers`,
    },
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[20px] bg-bg-surface p-5">
          <dt className="text-sm font-semibold">{item.label}</dt>
          <dd className="mt-3 truncate font-heading text-2xl font-bold xl:text-3xl">{item.value}</dd>
          <dd className={cn("mt-1 text-xs", item.tone ?? "text-text-primary/70")}>{item.note}</dd>
        </div>
      ))}
    </dl>
  );
}
