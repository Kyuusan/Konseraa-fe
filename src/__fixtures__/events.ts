// Dummy catalogue standing in for GET /events, /events/{id}/sessions,
// /events/{id}/ticket-tiers and reviews until the backend is wired up.
import {
  ConcertEventSchema,
  EventSessionSchema,
  ReviewSchema,
  TicketTierSchema,
  type ConcertEvent,
  type EventSession,
  type Review,
  type TicketTier,
} from "@/types/event";
import { fixtureId, unsplash } from "./ids";

const PHOTOS = {
  crowd: "photo-1514525253161-7a46d19cd819",
  lights: "photo-1501281668745-f7f57925c3b4",
  stage: "photo-1516450360452-9312f5e86fc7",
  festival: "photo-1459749411175-04bf5292ceea",
  hands: "photo-1540039155733-5bb30b53aa14",
  arena: "photo-1470229722913-7c0e2dbbafd3",
  club: "photo-1470225620780-dba8ba36b745",
  band: "photo-1501386761578-eac5c94b800a",
  guitar: "photo-1506157786151-b8491531f063",
};

const art = (photo: string) => ({
  poster_url: unsplash(photo, 800, 1000),
  banner_url: unsplash(photo, 1800, 700),
});

const VENUES = {
  istora: { id: fixtureId(101), name: "Istora Senayan", type: "indoor", city: "Jakarta", latitude: -6.2185, longitude: 106.8025, total_capacity: 7000, timezone: "Asia/Jakarta" },
  saparua: { id: fixtureId(102), name: "Lapangan Saparua", type: "outdoor", city: "Bandung", latitude: -6.9105, longitude: 107.6219, total_capacity: 12000, timezone: "Asia/Jakarta" },
  balaiPemuda: { id: fixtureId(103), name: "Balai Pemuda", type: "indoor", city: "Surabaya", latitude: -7.2633, longitude: 112.7447, total_capacity: 900, timezone: "Asia/Jakarta" },
  sgStadium: { id: fixtureId(104), name: "Singapore Indoor Stadium", type: "indoor", city: "Singapore", latitude: 1.3009, longitude: 103.8745, total_capacity: 12000, timezone: "Asia/Singapore" },
  kspo: { id: fixtureId(105), name: "KSPO Dome", type: "indoor", city: "Seoul", latitude: 37.5196, longitude: 127.1274, total_capacity: 15000, timezone: "Asia/Seoul" },
  gardenTheater: { id: fixtureId(106), name: "Tokyo Garden Theater", type: "indoor", city: "Tokyo", latitude: 35.6467, longitude: 139.7897, total_capacity: 8000, timezone: "Asia/Tokyo" },
  garudaPark: { id: fixtureId(107), name: "Garuda Wisnu Park", type: "outdoor", city: "Bali", latitude: -8.8104, longitude: 115.1676, total_capacity: 20000, timezone: "Asia/Makassar" },
} as const;

const RAW_EVENTS = [
  {
    id: fixtureId(1), slug: "neon-arcadia-world-tour", title: "Neon Arcadia World Tour",
    description: "The Midnight Static bring their synth-heavy live show to Jakarta for one night, with a reworked setlist built around the new record.",
    status: "published", min_price: 65, max_price: 120, venue: VENUES.istora, categories: ["Pop", "Electronic"],
    starts_at: "2026-12-12T20:00:00+07:00", ...art(PHOTOS.lights),
  },
  {
    id: fixtureId(2), slug: "gelora-fest-2026", title: "Gelora Fest 2026",
    description: "Two days of local indie and rock across one open-air stage. Each day has its own line-up and its own tickets.",
    status: "published", min_price: 30, max_price: 100, venue: VENUES.saparua, categories: ["Indie", "Rock"],
    starts_at: "2026-12-19T15:00:00+07:00", ...art(PHOTOS.festival),
  },
  {
    id: fixtureId(3), slug: "low-tide-sessions", title: "Low Tide Sessions",
    description: "An intimate seated jazz evening. Small room, short sets, and a quiet bar at the back.",
    status: "published", min_price: 25, max_price: 55, venue: VENUES.balaiPemuda, categories: ["Jazz"],
    starts_at: "2026-11-15T19:30:00+07:00", ...art(PHOTOS.band),
  },
  {
    id: fixtureId(4), slug: "paper-satellites-singapore", title: "Paper Satellites Live in Singapore",
    description: "The alt-rock five-piece close their Asia run in Singapore with a full production show.",
    status: "published", min_price: 85, max_price: 260, venue: VENUES.sgStadium, categories: ["Rock", "Alternative"],
    starts_at: "2027-02-06T20:00:00+08:00", ...art(PHOTOS.guitar),
  },
  {
    id: fixtureId(5), slug: "seoul-afterglow", title: "Seoul Afterglow",
    description: "A three-act K-pop showcase with a closing encore stage shared by all artists.",
    status: "published", min_price: 110, max_price: 320, venue: VENUES.kspo, categories: ["K-Pop", "Pop"],
    starts_at: "2027-03-13T18:00:00+09:00", ...art(PHOTOS.arena),
  },
  {
    id: fixtureId(6), slug: "harbour-lights-orchestra", title: "Harbour Lights Orchestra",
    description: "Film and game scores performed by a 60-piece orchestra, with a jazz trio for the second half.",
    status: "published", min_price: 70, max_price: 140, venue: VENUES.gardenTheater, categories: ["Classical", "Jazz"],
    starts_at: "2027-01-23T18:30:00+09:00", ...art(PHOTOS.stage),
  },
  {
    id: fixtureId(7), slug: "bass-assembly-nye", title: "Bass Assembly NYE",
    description: "New Year's Eve on an open-air cliff stage. Countdown at midnight, last set until 3am.",
    status: "published", min_price: 40, max_price: 140, venue: VENUES.garudaPark, categories: ["Electronic"],
    starts_at: "2026-12-31T20:00:00+08:00", ...art(PHOTOS.club),
  },
  {
    id: fixtureId(8), slug: "echoes-in-bloom", title: "Echoes in Bloom",
    description: "The Jakarta stop of the Echoes in Bloom tour. This show has ended; reviews are open to ticket holders.",
    status: "completed", min_price: 35, max_price: 90, venue: VENUES.istora, categories: ["Indie", "Pop"],
    starts_at: "2026-10-17T19:00:00+07:00", ...art(PHOTOS.hands),
  },
];

export const EVENTS: ConcertEvent[] = ConcertEventSchema.array().parse(RAW_EVENTS);

const FEATURED_SLUGS = ["neon-arcadia-world-tour", "paper-satellites-singapore", "seoul-afterglow", "bass-assembly-nye"];

const artist = (n: number, name: string, photo: string) => ({
  id: fixtureId(300 + n), name, image_url: unsplash(photo, 400, 400),
});

const RAW_SESSIONS: Record<string, unknown[]> = {
  [fixtureId(1)]: [
    { id: fixtureId(201), name: "Main show", start_at: "2026-12-12T20:00:00+07:00", end_at: "2026-12-12T23:00:00+07:00",
      artists: [artist(1, "The Midnight Static", PHOTOS.lights), artist(2, "Vela Rose", PHOTOS.crowd)] },
  ],
  [fixtureId(2)]: [
    { id: fixtureId(202), name: "Day 1", start_at: "2026-12-19T15:00:00+07:00", end_at: "2026-12-19T23:00:00+07:00",
      artists: [artist(3, "Kalasan", PHOTOS.band), artist(4, "Rumah Kaca", PHOTOS.guitar), artist(5, "Sore Hari", PHOTOS.festival)] },
    { id: fixtureId(203), name: "Day 2", start_at: "2026-12-20T15:00:00+07:00", end_at: "2026-12-20T23:00:00+07:00",
      artists: [artist(6, "Lintas Timur", PHOTOS.stage), artist(7, "Paviliun", PHOTOS.hands)] },
  ],
  [fixtureId(3)]: [
    { id: fixtureId(204), name: "Evening set", start_at: "2026-11-15T19:30:00+07:00", end_at: "2026-11-15T22:00:00+07:00",
      artists: [artist(8, "Rania Trio", PHOTOS.band)] },
  ],
  [fixtureId(4)]: [
    { id: fixtureId(205), name: "Main show", start_at: "2027-02-06T20:00:00+08:00", end_at: "2027-02-06T23:00:00+08:00",
      artists: [artist(9, "Paper Satellites", PHOTOS.guitar)] },
  ],
  [fixtureId(5)]: [
    { id: fixtureId(206), name: "Showcase", start_at: "2027-03-13T18:00:00+09:00", end_at: "2027-03-13T22:00:00+09:00",
      artists: [artist(10, "LUMEN", PHOTOS.arena), artist(11, "Haneul", PHOTOS.lights), artist(12, "Orbit 7", PHOTOS.crowd)] },
  ],
  [fixtureId(6)]: [
    { id: fixtureId(207), name: "Evening concert", start_at: "2027-01-23T18:30:00+09:00", end_at: "2027-01-23T21:30:00+09:00",
      artists: [artist(13, "Harbour Lights Orchestra", PHOTOS.stage), artist(14, "Kaito Mori Trio", PHOTOS.band)] },
  ],
  [fixtureId(7)]: [
    { id: fixtureId(208), name: "NYE night", start_at: "2026-12-31T20:00:00+08:00", end_at: "2027-01-01T03:00:00+08:00",
      artists: [artist(15, "Subsonic Tide", PHOTOS.club), artist(16, "DJ Arka", PHOTOS.crowd)] },
  ],
  [fixtureId(8)]: [
    { id: fixtureId(209), name: "Main show", start_at: "2026-10-17T19:00:00+07:00", end_at: "2026-10-17T22:30:00+07:00",
      artists: [artist(17, "Echoes in Bloom", PHOTOS.hands)] },
  ],
};

const tier = (n: number, name: string, tier_type: string, price: number, available_quota: number, max_per_transaction = 6) => ({
  id: fixtureId(400 + n), name, tier_type, price, available_quota, max_per_transaction,
});

const RAW_TIERS: Record<string, unknown[]> = {
  [fixtureId(1)]: [tier(1, "Early Bird", "early_bird", 45, 0), tier(2, "Festival", "regular", 65, 420), tier(3, "VIP Standing", "vip", 120, 60, 4)],
  [fixtureId(2)]: [tier(4, "Regular", "regular", 30, 1500), tier(5, "VIP Deck", "vip", 70, 120, 4), tier(6, "Group of 4", "group_package", 100, 40, 1)],
  [fixtureId(3)]: [tier(7, "Seated", "regular", 25, 18), tier(8, "Front Table", "vip", 55, 4, 2)],
  [fixtureId(4)]: [tier(9, "Category 3", "regular", 85, 900), tier(10, "Category 1", "vip", 150, 240, 4), tier(11, "Front Row", "vvip", 260, 30, 2)],
  [fixtureId(5)]: [tier(12, "Standard", "regular", 110, 2000), tier(13, "Floor", "vip", 180, 300, 4), tier(14, "Soundcheck Pass", "vvip", 320, 12, 2)],
  [fixtureId(6)]: [tier(15, "Balcony", "regular", 70, 600), tier(16, "Stalls", "vip", 140, 150, 4)],
  [fixtureId(7)]: [tier(17, "Early Bird", "early_bird", 40, 35), tier(18, "General", "regular", 60, 3000), tier(19, "Cliff Deck", "vip", 140, 200, 4)],
  [fixtureId(8)]: [tier(20, "Regular", "regular", 35, 0), tier(21, "VIP", "vip", 90, 0, 4)],
};

const RAW_REVIEWS: Record<string, unknown[]> = {
  [fixtureId(8)]: [
    { id: fixtureId(501), user_full_name: "Nadia P.", rating: 5, comment: "Sound was clean all night and the encore was worth the wait.", created_at: "2026-10-18T09:12:00+07:00" },
    { id: fixtureId(502), user_full_name: "Bima S.", rating: 4, comment: "Great show. Entry queue was slow for the first half hour.", created_at: "2026-10-18T13:40:00+07:00" },
    { id: fixtureId(503), user_full_name: "Laras W.", rating: 5, comment: "Best live set I've seen this year.", created_at: "2026-10-19T20:05:00+07:00" },
  ],
};

const SESSIONS = new Map(Object.entries(RAW_SESSIONS).map(([id, raw]) => [id, EventSessionSchema.array().parse(raw)]));
const TIERS = new Map(Object.entries(RAW_TIERS).map(([id, raw]) => [id, TicketTierSchema.array().parse(raw)]));
const REVIEWS = new Map(Object.entries(RAW_REVIEWS).map(([id, raw]) => [id, ReviewSchema.array().parse(raw)]));

/** Stands in for the user's favourite genres from GET /users/me/preferences. */
export const FAVORITE_GENRES = ["Indie", "Rock", "Jazz"];

export const getFeaturedEvents = () => EVENTS.filter((event) => FEATURED_SLUGS.includes(event.slug));
export const getEventBySlug = (slug: string) => EVENTS.find((event) => event.slug === slug);
export const getEventSessions = (eventId: string): EventSession[] => SESSIONS.get(eventId) ?? [];
export const getEventTicketTiers = (eventId: string): TicketTier[] => TIERS.get(eventId) ?? [];
export const getEventReviews = (eventId: string): Review[] => REVIEWS.get(eventId) ?? [];
