// Shared by the server session fixture and the client demo switcher. Until the
// backend exists, the organizer state lives in demo cookies.
export const DEMO_ORGANIZER_STATES = ["none", "pending", "in_review", "rejected", "approved"] as const;
export type DemoOrganizerState = (typeof DEMO_ORGANIZER_STATES)[number];

export const DEMO_STATE_COOKIE = "konsera-demo-organizer";
/** Non-sensitive summary of the submitted form (no NIK, no documents). */
export const DEMO_APPLICATION_COOKIE = "konsera-demo-application";
/** Id of the gatekeeper signed in at /login; absent for everyone else. */
export const DEMO_GATEKEEPER_COOKIE = "konsera-demo-gatekeeper";

export type DemoApplicationSummary = {
  company_name: string;
  organizer_type: "individual" | "company";
  city: string;
  address: string;
  pic_name: string;
  pic_email: string;
};

export function writeDemoCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function clearDemoCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}
