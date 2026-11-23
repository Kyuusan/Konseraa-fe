"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatPrice, formatPriceCompact } from "@/lib/format";

type MonthSales = { month: string; gross: number };

const chartConfig = {
  gross: { label: "Gross sales", color: "var(--color-accent-lime)" },
} satisfies ChartConfig;

const AXIS_TICK = { fill: "var(--color-text-primary)", fillOpacity: 0.7, fontSize: 12 };

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

export function SalesChart({ data }: { data: MonthSales[] }) {
  const rows = data.map((item) => ({ ...item, label: monthLabel.format(new Date(`${item.month}-01T00:00:00Z`)) }));
  const current = rows.at(-1);

  return (
    <section aria-labelledby="sales-chart-heading" className="flex flex-col gap-6 rounded-[20px] bg-bg-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="sales-chart-heading" className="text-sm font-semibold text-text-primary">Gross sales</h2>
          <p className="font-heading text-3xl font-bold">{formatPrice(current?.gross ?? 0)}</p>
          <p className="text-xs text-text-primary/70">This month</p>
        </div>
        <p className="rounded-full bg-bg-surface-2 px-3 py-1 text-xs font-semibold">Last 6 months</p>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
        <AreaChart data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 0 }} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--color-border)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} tick={AXIS_TICK} />
          <YAxis tickFormatter={(value: number) => formatPriceCompact(value)} tickLine={false} axisLine={false} width={56} tick={AXIS_TICK} />
          <ChartTooltip
            cursor={{ stroke: "var(--color-text-muted)", strokeDasharray: "4 4" }}
            content={<ChartTooltipContent formatter={(value) => formatPrice(Number(value))} />}
          />
          {/* A flat, faint fill under the line; no gradient. */}
          <Area
            dataKey="gross"
            type="monotone"
            stroke="var(--color-gross)"
            strokeWidth={2.5}
            fill="var(--color-gross)"
            fillOpacity={0.08}
            dot={{ r: 3, fill: "var(--color-bg-surface)", stroke: "var(--color-gross)", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "var(--color-gross)", stroke: "var(--color-bg-surface)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
