"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  value: { label: "Sold", color: "var(--color-accent-lime)" },
} satisfies ChartConfig;

interface ProgressRingProps {
  percent: number;
  label: string;
  size?: number;
}

// Recharts radial bar: lime arc on a muted track, the percentage in the middle.
export function ProgressRing({ percent, label, size = 112 }: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${clamped}% ${label}`}>
      <ChartContainer config={chartConfig} className="aspect-square size-full">
        <RadialBarChart
          data={[{ name: "value", value: clamped }]}
          startAngle={90}
          endAngle={-270}
          innerRadius="78%"
          outerRadius="100%"
          barSize={10}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar dataKey="value" fill="var(--color-value)" background={{ fill: "var(--color-bg-surface-2)" }} cornerRadius={10} />
        </RadialBarChart>
      </ChartContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="font-heading text-2xl font-bold">{clamped}%</span>
        <span className="text-[11px] text-text-primary/70">{label}</span>
      </div>
    </div>
  );
}
