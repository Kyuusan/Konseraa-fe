"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatNumber, formatPrice } from "@/lib/format";
import type { DailySales } from "@/types/analytics";

const chartConfig = {
  tickets: { label: "Tickets", color: "var(--color-accent-lime)" },
} satisfies ChartConfig;

const AXIS_TICK = { fill: "var(--color-text-primary)", fillOpacity: 0.7, fontSize: 12 };
const dayLabel = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", timeZone: "UTC" });

interface DailySalesChartProps {
  daily: DailySales[];
  windowTickets: number;
  windowGross: number;
}

// Same line style as the dashboard chart: a faint flat fill, no gradient.
export function DailySalesChart({ daily, windowTickets, windowGross }: DailySalesChartProps) {
  const rows = daily.map((day) => ({ ...day, label: dayLabel.format(new Date(`${day.date}T00:00:00Z`)) }));

  return (
    <section aria-labelledby="daily-heading" className="flex flex-col gap-6 rounded-[20px] bg-bg-surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="daily-heading" className="text-sm font-semibold">
            Daily ticket sales
          </h2>
          <p className="font-heading text-3xl font-bold">{formatNumber(windowTickets)} tickets</p>
          <p className="text-xs text-text-primary/70">{formatPrice(windowGross)} gross in this period</p>
        </div>
        <p className="rounded-full bg-bg-surface-2 px-3 py-1 text-xs font-semibold">
          {rows[0]?.label} – {rows.at(-1)?.label}
        </p>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <AreaChart data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 0 }} accessibilityLayer>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--color-border)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} tick={AXIS_TICK} />
          <YAxis tickFormatter={(value: number) => formatNumber(value)} tickLine={false} axisLine={false} width={44} tick={AXIS_TICK} />
          <ChartTooltip
            cursor={{ stroke: "var(--color-text-muted)", strokeDasharray: "4 4" }}
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) =>
                  `${formatNumber(Number(value))} tickets · ${formatPrice(Number((item.payload as DailySales).gross))}`
                }
              />
            }
          />
          <Area
            dataKey="tickets"
            type="monotone"
            stroke="var(--color-tickets)"
            strokeWidth={2.5}
            fill="var(--color-tickets)"
            fillOpacity={0.08}
            dot={false}
            activeDot={{ r: 5, fill: "var(--color-tickets)", stroke: "var(--color-bg-surface)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
