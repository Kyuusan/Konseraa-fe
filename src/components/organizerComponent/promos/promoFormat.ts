import { formatDateTime, formatPrice } from "@/lib/format";
import type { Promo } from "@/types/promo";

/** Promo dates are set in the organizer's own zone. */
export const PROMO_TIME_ZONE = "Asia/Jakarta";

export const formatDiscount = (promo: Pick<Promo, "discount_type" | "discount_value"> & { max_discount_amount?: number | null }) =>
  promo.discount_type === "percentage"
    ? `${promo.discount_value}% off${promo.max_discount_amount ? `, up to ${formatPrice(promo.max_discount_amount)}` : ""}`
    : `${formatPrice(promo.discount_value)} off`;

export const formatValidity = (promo: Pick<Promo, "starts_at" | "ends_at">) =>
  `${formatDateTime(promo.starts_at, PROMO_TIME_ZONE, { day: "numeric", month: "short" })} – ${formatDateTime(
    promo.ends_at,
    PROMO_TIME_ZONE,
    { day: "numeric", month: "short", year: "numeric" },
  )}`;

// Tabs on the promo list.
export const PROMO_FILTERS = [
  { value: "all", label: "All", statuses: null },
  { value: "active", label: "Active", statuses: ["active"] },
  { value: "scheduled", label: "Scheduled", statuses: ["scheduled"] },
  { value: "ended", label: "Ended", statuses: ["expired", "used_up"] },
  { value: "inactive", label: "Turned off", statuses: ["inactive"] },
] as const satisfies readonly { value: string; label: string; statuses: readonly Promo["status"][] | null }[];
