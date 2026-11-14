import { z } from "zod";

// Shapes follow openapi-spec.yaml. Fields marked "not in spec" are what the PRD
// screens (§13) need but the spec does not define yet; confirm with backend.

const IsoDateTime = z.iso.datetime({ offset: true });

export const VENUE_TYPES = ["indoor", "outdoor", "hybrid"] as const;

export const VenueSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(VENUE_TYPES),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  total_capacity: z.int().nonnegative(),
  /** Not in spec: IANA zone, so times show in venue time (rules §15 #12). */
  timezone: z.string(),
});
export type Venue = z.infer<typeof VenueSchema>;

export const EVENT_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "published",
  "ongoing",
  "completed",
  "cancelled",
] as const;

export const ConcertEventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  poster_url: z.url(),
  status: z.enum(EVENT_STATUSES),
  min_price: z.number().nonnegative(),
  max_price: z.number().nonnegative(),
  venue: VenueSchema,
  categories: z.array(z.string()),
  /** Not in spec: wide banner for the event detail header (PRD §13.2). */
  banner_url: z.url(),
  /** Not in spec: first session start, for cards and the date filter. */
  starts_at: IsoDateTime,
});
export type ConcertEvent = z.infer<typeof ConcertEventSchema>;

export const TICKET_TIER_TYPES = ["early_bird", "regular", "vip", "vvip", "group_package"] as const;

export const TicketTierSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  tier_type: z.enum(TICKET_TIER_TYPES),
  price: z.number().nonnegative(),
  max_per_transaction: z.int().positive(),
  available_quota: z.int().nonnegative(),
});
export type TicketTier = z.infer<typeof TicketTierSchema>;

/** Not in spec (GET /events/{id}/sessions has no schema): mirrors artists + event_artists. */
export const ArtistSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  image_url: z.url(),
});
export type Artist = z.infer<typeof ArtistSchema>;

/** Not in spec (GET /events/{id}/sessions has no schema): mirrors event_sessions. */
export const EventSessionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  start_at: IsoDateTime,
  end_at: IsoDateTime,
  artists: z.array(ArtistSchema),
});
export type EventSession = z.infer<typeof EventSessionSchema>;

/** Not in spec (no review endpoint yet): mirrors the reviews table. */
export const ReviewSchema = z.object({
  id: z.uuid(),
  user_full_name: z.string(),
  rating: z.int().min(1).max(5),
  comment: z.string(),
  created_at: IsoDateTime,
});
export type Review = z.infer<typeof ReviewSchema>;

export const EVENT_SORTS = ["newest", "price_asc", "price_desc", "popularity"] as const;
export type EventSort = (typeof EVENT_SORTS)[number];
