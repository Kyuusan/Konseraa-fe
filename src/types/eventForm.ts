import { z } from "zod";
import { MAX_TICKETS_PER_TRANSACTION } from "@/lib/constants";
import { TICKET_TIER_TYPES, VENUE_TYPES } from "./event";
import { DocumentFileSchema } from "./organizer";

// The "Create event" wizard (PRD §13.7). The spec only has POST /events with the
// Event schema, so these step shapes are derived from the domain enums plus the
// fields the wizard needs; everything here is "not in spec" until backend confirms.

const requiredFile = (message: string) => DocumentFileSchema.nullable().refine(Boolean, message);
const positiveInt = (message: string) => z.coerce.number<string>().int(message).positive(message);

export const EventBasicsFormSchema = z.object({
  title: z.string().trim().min(3, "Give the event a title."),
  description: z.string().trim().min(30, "Describe the event in at least 30 characters."),
  categories: z.array(z.string()).min(1, "Pick at least one category."),
  poster: requiredFile("Upload a poster."),
  banner: requiredFile("Upload a banner."),
});

export const EventVenueFormSchema = z.object({
  name: z.string().trim().min(2, "Enter the venue name."),
  type: z.enum(VENUE_TYPES),
  city: z.string().trim().min(2, "Enter the city."),
  address: z.string().trim().min(10, "Enter the full address."),
  timezone: z.string().min(1, "Pick the venue time zone."),
  capacity: positiveInt("Enter the venue capacity."),
  /** Crowd permit or venue approval for this event (agreed verification flow). */
  permit: requiredFile("Upload the crowd permit or venue approval."),
});

export const EventSessionFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name the session."),
    date: z.string().min(1, "Pick a date."),
    start: z.string().min(1, "Set a start time."),
    end: z.string().min(1, "Set an end time."),
    lineup: z.string().trim().min(1, "Add at least one artist."),
  })
  .refine((session) => session.end > session.start, { path: ["end"], message: "End after the start time." });

/** Limits for a generated seat grid (assumed; the backend models set none). */
export const MAX_SECTION_ROWS = 26;
export const MAX_SEATS_PER_ROW = 60;

const wholeIn = (value: string, min: number, max: number) => /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max;

/**
 * One venue_sections row. Standing areas give a capacity; seated areas give rows ×
 * seats per row, which become seats (row_label, seat_number, coords) on save.
 */
export const EventSectionFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name the area."),
    is_seated: z.boolean(),
    capacity: z.string(),
    rows: z.string(),
    seats_per_row: z.string(),
  })
  .superRefine((section, ctx) => {
    if (!section.is_seated && !wholeIn(section.capacity, 1, 1_000_000)) {
      ctx.addIssue({ code: "custom", path: ["capacity"], message: "Enter how many people fit." });
    }
    if (section.is_seated && !wholeIn(section.rows, 1, MAX_SECTION_ROWS)) {
      ctx.addIssue({ code: "custom", path: ["rows"], message: `1 to ${MAX_SECTION_ROWS} rows.` });
    }
    if (section.is_seated && !wholeIn(section.seats_per_row, 1, MAX_SEATS_PER_ROW)) {
      ctx.addIssue({ code: "custom", path: ["seats_per_row"], message: `1 to ${MAX_SEATS_PER_ROW} seats.` });
    }
  });

/** Areas are optional: without them buyers only see the tier list. */
export const EventSectionsFormSchema = z.array(EventSectionFormSchema);

export const EventTierFormSchema = z.object({
  name: z.string().trim().min(1, "Name the tier."),
  tier_type: z.enum(TICKET_TIER_TYPES),
  price: z.coerce.number<string>().nonnegative("Enter a price of 0 or more."),
  /** Quota per session (PRD §3B: inventory per tier per session). */
  quota: positiveInt("Enter a quota."),
  max_per_transaction: z.coerce
    .number<string>()
    .int()
    .min(1, "At least 1.")
    .max(MAX_TICKETS_PER_TRANSACTION, `At most ${MAX_TICKETS_PER_TRANSACTION} per transaction.`),
  /** Key of the area (venue section) this tier admits to; "" for none. */
  section_key: z.string(),
});

export const EventSessionsFormSchema = z.array(EventSessionFormSchema).min(1, "Add at least one session.");
export const EventTiersFormSchema = z.array(EventTierFormSchema).min(1, "Add at least one ticket tier.");

// What the inputs hold (numbers are still strings). Rows carry a React key.
export type EventBasicsForm = z.input<typeof EventBasicsFormSchema>;
export type EventVenueForm = z.input<typeof EventVenueFormSchema>;
export type EventSessionForm = z.input<typeof EventSessionFormSchema> & { key: string };
export type EventTierForm = z.input<typeof EventTierFormSchema> & { key: string };
export type EventSectionForm = z.input<typeof EventSectionFormSchema> & { key: string };
