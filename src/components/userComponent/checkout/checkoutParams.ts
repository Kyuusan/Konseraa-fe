import { MAX_TICKETS_PER_TRANSACTION } from "@/lib/constants";
import { AddCartItemSchema, type AddCartItem } from "@/types/booking";

// Until the backend holds carts server-side, the hold is carried between the
// ticket, checkout and payment pages in the URL.

export type CheckoutSelection = {
  eventSlug: string;
  sessionId: string;
  items: AddCartItem[];
  heldUntil: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

export const param = (params: SearchParams, key: string) => {
  const value = params[key];
  return typeof value === "string" ? value : undefined;
};

export function toCheckoutQuery(selection: CheckoutSelection, extra: Record<string, string> = {}) {
  return new URLSearchParams({
    event: selection.eventSlug,
    session: selection.sessionId,
    items: selection.items.map((item) => `${item.ticket_tier_id}:${item.quantity}`).join(","),
    held_until: selection.heldUntil,
    ...extra,
  }).toString();
}

export function parseCheckoutSelection(params: SearchParams): CheckoutSelection | null {
  const eventSlug = param(params, "event");
  const sessionId = param(params, "session");
  const rawItems = param(params, "items");
  const heldUntil = param(params, "held_until");
  if (!eventSlug || !sessionId || !rawItems || !heldUntil || Number.isNaN(Date.parse(heldUntil))) return null;

  const parsed = rawItems.split(",").map((entry) => {
    const [ticket_tier_id, quantity] = entry.split(":");
    return AddCartItemSchema.safeParse({ ticket_tier_id, event_session_id: sessionId, quantity: Number(quantity) });
  });
  if (parsed.some((result) => !result.success)) return null;

  const items = parsed.flatMap((result) => (result.success ? [result.data] : []));
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  if (items.length === 0 || total > MAX_TICKETS_PER_TRANSACTION) return null;

  return { eventSlug, sessionId, items, heldUntil };
}
