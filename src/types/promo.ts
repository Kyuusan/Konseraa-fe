import { z } from "zod";

// Not in spec: the spec only has `promo_code` on the booking request. These shapes
// mirror promo_codes (PRD §6) with the agreed rules; confirm with backend.

export const DISCOUNT_TYPES = ["percentage", "fixed"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

/** Computed by the backend from the dates, usage and the active switch. */
export const PROMO_STATUSES = ["active", "scheduled", "expired", "used_up", "inactive"] as const;
export type PromoStatus = (typeof PROMO_STATUSES)[number];

const IsoDateTime = z.iso.datetime({ offset: true });

export const PromoSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  discount_type: z.enum(DISCOUNT_TYPES),
  /** Percent (1–100) or an amount in USD. */
  discount_value: z.number().positive(),
  /** promo_codes.max_discount_amount (backend models): cap, in USD, for a percentage discount. */
  max_discount_amount: z.number().positive().nullable().default(null),
  /** null: valid for every event of the organizer. */
  event_id: z.uuid().nullable(),
  usage_limit: z.int().positive(),
  per_user_limit: z.int().positive(),
  used_count: z.int().nonnegative(),
  starts_at: IsoDateTime,
  ends_at: IsoDateTime,
  is_active: z.boolean(),
  status: z.enum(PROMO_STATUSES),
});
export type Promo = z.infer<typeof PromoSchema>;

export const PROMO_CODE_PATTERN = /^[A-Z0-9]{4,16}$/;

export const PromoFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(PROMO_CODE_PATTERN, "Use 4 to 16 letters or numbers, no spaces."),
    discount_type: z.enum(DISCOUNT_TYPES),
    discount_value: z.coerce.number<string>().positive("Enter a discount above 0."),
    /** Optional cap for a percentage discount; "" for none. */
    max_discount_amount: z.string().trim().regex(/^(\d+(\.\d{1,2})?)?$/, "Enter an amount like 20 or 12.50."),
    /** "all" or an event id. */
    event_id: z.string().min(1),
    usage_limit: z.coerce.number<string>().int("Use a whole number.").positive("Enter how many times it can be used."),
    per_user_limit: z.coerce.number<string>().int("Use a whole number.").positive("At least 1 per account."),
    starts_on: z.string().min(1, "Pick when the code starts."),
    ends_on: z.string().min(1, "Pick when the code ends."),
  })
  .refine((promo) => promo.discount_type !== "percentage" || promo.discount_value <= 100, {
    path: ["discount_value"],
    message: "A percentage discount can be at most 100%.",
  })
  .refine((promo) => promo.per_user_limit <= promo.usage_limit, {
    path: ["per_user_limit"],
    message: "Cannot be more than the total limit.",
  })
  .refine((promo) => promo.ends_on >= promo.starts_on, { path: ["ends_on"], message: "End on or after the start date." });

export type PromoForm = z.input<typeof PromoFormSchema>;
