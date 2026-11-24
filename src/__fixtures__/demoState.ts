// Shared by the server session fixture and the client demo switcher. Until the
// backend exists, the organizer state lives in demo cookies.
export const DEMO_ORGANIZER_STATES = ["none", "pending", "in_review", "rejected", "approved"] as const;
export type DemoOrganizerState = (typeof DEMO_ORGANIZER_STATES)[number];

export const DEMO_STATE_COOKIE = "konsera-demo-organizer";
/** Non-sensitive summary of the submitted form (no documents). */
export const DEMO_APPLICATION_COOKIE = "konsera-demo-application";
/** Id of the gatekeeper signed in at /login; absent for everyone else. */
export const DEMO_GATEKEEPER_COOKIE = "konsera-demo-gatekeeper";

export type DemoApplicationSummary = {
  company_name: string;
  legal_entity_type: "individual" | "company";
};

export function writeDemoCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function clearDemoCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

/** Event ids the demo user saved (backend: favorites { user_id, event_id }). */
export const DEMO_FAVORITES_COOKIE = "konsera-demo-favorites";
/** Saved before the cookie exists: Seoul Afterglow and Harbour Lights Orchestra. */
export const DEFAULT_FAVORITE_EVENT_IDS = ["00000000-0000-4000-8000-000000000005", "00000000-0000-4000-8000-000000000006"];

export const parseFavoriteIds = (raw: string | undefined) =>
  raw === undefined ? DEFAULT_FAVORITE_EVENT_IDS : decodeURIComponent(raw).split(",").filter(Boolean);
