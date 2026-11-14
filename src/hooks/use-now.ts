"use client";

import { useSyncExternalStore } from "react";

// One shared 1-second clock for countdowns. The server snapshot is null, so
// time-dependent text only renders in the browser and never mismatches on hydration.
let now = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((notify) => notify());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}

/** Milliseconds left until `iso`, or null before the browser clock is available. */
export function useRemaining(iso: string) {
  const current = useNow();
  if (current === null) return null;
  return Math.max(0, new Date(iso).getTime() - current);
}
