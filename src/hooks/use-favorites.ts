"use client";

import { useSyncExternalStore } from "react";
import { DEMO_FAVORITES_COOKIE, parseFavoriteIds, writeDemoCookie } from "@/__fixtures__/demoState";

// Saved events, shared by every heart button on the page. Stands in for
// GET/POST/DELETE favorites; the demo keeps the list in a cookie so server pages can read it too.
const listeners = new Set<() => void>();

function readRaw() {
  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${DEMO_FAVORITES_COOKIE}=`));
  return entry === undefined ? undefined : entry.slice(DEMO_FAVORITES_COOKIE.length + 1);
}

const snapshot = () => parseFavoriteIds(readRaw()).join(",");

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFavorites() {
  // null on the server and during hydration: the list lives in the browser cookie.
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const ids = raw === null ? null : raw.split(",").filter(Boolean);

  function toggle(eventId: string) {
    const current = parseFavoriteIds(readRaw());
    const next = current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId];
    writeDemoCookie(DEMO_FAVORITES_COOKIE, next.join(","));
    listeners.forEach((notify) => notify());
  }

  return { ids, isSaved: (eventId: string) => ids?.includes(eventId) ?? false, toggle };
}
