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
  /** ticket_tiers.venue_section_id (backend models): the area this tier admits to. */
  venue_section_id: z.uuid().nullable().default(null),
  /** ticket_tiers.is_seated (backend models). */
  is_seated: z.boolean().default(false),
});
export type TicketTier = z.infer<typeof TicketTierSchema>;

// The seat map is built from the venue layout in the backend models (venue_sections
// + seats), not from an uploaded image: there is no column for one.

/** venue_sections: one area of a venue, standing or seated. */
export const VenueSectionSchema = z.object({
  id: z.uuid(),
  venue_id: z.uuid(),
  name: z.string(),
  capacity: z.int().positive(),
  is_seated: z.boolean(),
});
export type VenueSection = z.infer<typeof VenueSectionSchema>;

/** seats: one seat of a seated section; coords place it inside its section. */
export const SeatSchema = z.object({
  id: z.uuid(),
  venue_section_id: z.uuid(),
  row_label: z.string(),
  seat_number: z.string(),
  coord_x: z.number().nullable(),
  coord_y: z.number().nullable(),
});
export type Seat = z.infer<typeof SeatSchema>;

/** A venue's sections and seats, front of house first. */
export const VenueLayoutSchema = z.object({
  sections: z.array(VenueSectionSchema),
  seats: z.array(SeatSchema),
});
export type VenueLayout = z.infer<typeof VenueLayoutSchema>;

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

export const REVIEW_STATUSES = ["published", "hidden"] as const;

/** Not in spec (no review endpoint yet): mirrors the reviews table. */
export const ReviewSchema = z.object({
  id: z.uuid(),
  user_full_name: z.string(),
  rating: z.int().min(1).max(5),
  comment: z.string(),
  /** reviews.photo_urls in the backend models (not in the OpenAPI spec). */
  photo_urls: z.array(z.string()).default([]),
  /** reviews.status in the backend models: admins hide reviews that break the rules. */
  status: z.enum(REVIEW_STATUSES).default("published"),
  created_at: IsoDateTime,
});
export type Review = z.infer<typeof ReviewSchema>;

/** Assumed limits for review photos (not in the PRD): up to 3 images of 5 MB. */
export const MAX_REVIEW_PHOTOS = 3;

/** Not in spec (no review endpoint yet): what an attendee submits. */
export const ReviewFormSchema = z.object({
  rating: z.int().min(1, "Pick a rating from 1 to 5.").max(5),
  comment: z
    .string()
    .trim()
    .min(20, "Tell other fans a bit more (at least 20 characters).")
    .max(1000, "Keep it under 1000 characters."),
  photo_urls: z.array(z.string()).max(MAX_REVIEW_PHOTOS, `Add up to ${MAX_REVIEW_PHOTOS} photos.`),
});
export type ReviewForm = z.infer<typeof ReviewFormSchema>;

/** Not in spec: reviews of an earlier edition or tour stop, shown before this show has happened. */
export const PastShowReviewsSchema = z.object({
  show_title: z.string(),
  show_date: IsoDateTime,
  reviews: z.array(ReviewSchema),
});
export type PastShowReviews = z.infer<typeof PastShowReviewsSchema>;

export const EVENT_SORTS = ["newest", "price_asc", "price_desc", "popularity"] as const;
export type EventSort = (typeof EVENT_SORTS)[number];
