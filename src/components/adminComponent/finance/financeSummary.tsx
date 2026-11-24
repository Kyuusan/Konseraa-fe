import { formatPrice } from "@/lib/format";
import type { FinanceSummary as Summary } from "@/types/admin";

export function FinanceSummary({ summary }: { summary: Summary }) {
  const items = [
    { label: "Gross sales", value: summary.month_gross, note: "This month" },
    { label: "Commission earned", value: summary.month_commission, note: "This month" },
    { label: "Commission all time", value: summary.all_time_commission, note: "Since launch" },
    { label: "Refunded", value: summary.month_refunds, note: "This month" },
    { label: "Payouts to send", value: summary.scheduled_payouts_total, note: "Scheduled or processing" },
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-[20px] bg-bg-surface p-5">
          <dt className="text-sm font-semibold">{item.label}</dt>
          <dd className="mt-3 truncate font-heading text-2xl font-bold">{formatPrice(item.value)}</dd>
          <dd className="mt-1 text-xs text-text-primary/70">{item.note}</dd>
        </div>
      ))}
    </dl>
  );
}
