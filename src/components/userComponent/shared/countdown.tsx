"use client";

import { useRemaining } from "@/hooks/use-now";

const pad = (value: number) => String(value).padStart(2, "0");

export function formatRemaining(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

// Counts down to a server-provided deadline (held_until, expires_at); never to a local constant.
export function Countdown({ until }: { until: string }) {
  const remaining = useRemaining(until);
  return (
    <span className="font-heading font-semibold tabular-nums">
      {remaining === null ? "--:--" : formatRemaining(remaining)}
    </span>
  );
}
