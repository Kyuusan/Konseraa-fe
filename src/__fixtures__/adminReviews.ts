// Dummy review queues for the admin: organizer applications (KYC) and events
// waiting for GET /admin/events/pending. The dashboard lists are derived from these.
import { AdminEventReviewSchema, AdminVerificationSchema } from "@/types/admin";
import { getEventBySlug, getEventSessions, getEventTicketTiers } from "./events";
import { fixtureId, unsplash } from "./ids";
import { getOrganizerEventDetail } from "./organizerEvents";

const doc = (name: string, size: number, mime_type = "application/pdf") => ({ name, size, mime_type });

const application = (
  n: number,
  organizer: { name: string; type: "company" | "individual"; city: string; address: string },
  pic: { name: string; nik: string; phone: string; email: string },
  review: { status: string; submitted_at: string; reviewed_at?: string; rejection_reason?: string },
) => ({
  organizer: {
    id: fixtureId(2100 + n),
    company_name: organizer.name,
    verification_status: review.status,
    organizer_type: organizer.type,
    city: organizer.city,
    address: organizer.address,
  },
  verification: {
    id: fixtureId(2150 + n),
    organizer_id: fixtureId(2100 + n),
    status: review.status,
    person_in_charge: { full_name: pic.name, nik: pic.nik, phone: pic.phone, email: pic.email },
    id_card: doc(`ktp-${pic.name.toLowerCase().replaceAll(" ", "-")}.jpg`, 486_000, "image/jpeg"),
    business_document: organizer.type === "company" ? doc(`nib-${organizer.name.toLowerCase().replaceAll(" ", "-")}.pdf`, 912_000) : null,
    submitted_at: review.submitted_at,
    reviewed_at: review.reviewed_at ?? null,
    rejection_reason: review.rejection_reason ?? null,
  },
});

export const VERIFICATIONS = AdminVerificationSchema.array().parse([
  application(
    1,
    { name: "Rimba Sound", type: "company", city: "Medan", address: "Jl. Gatot Subroto No. 118, Medan Petisah, Medan 20112" },
    { name: "Hendra Sitompul", nik: "1271021405880003", phone: "+6281361234455", email: "hendra@rimbasound.id" },
    { status: "in_review", submitted_at: "2026-11-16T13:05:00+07:00" },
  ),
  application(
    2,
    { name: "Naya Putri", type: "individual", city: "Malang", address: "Jl. Ijen No. 27, Klojen, Malang 65119" },
    { name: "Naya Putri", nik: "3573045503970002", phone: "+6285755501234", email: "naya.putri@gmail.com" },
    { status: "pending", submitted_at: "2026-11-18T11:30:00+07:00" },
  ),
  application(
    3,
    { name: "Gema Timur Events", type: "company", city: "Makassar", address: "Jl. Boulevard Panakkukang Blok F2 No. 7, Makassar 90231" },
    { name: "Andi Rahman", nik: "7371031208850001", phone: "+6281242219876", email: "andi@gematimur.co.id" },
    { status: "pending", submitted_at: "2026-11-19T08:15:00+07:00" },
  ),
  application(
    4,
    { name: "Nada Kota Productions", type: "company", city: "Jakarta", address: "Jl. Senopati No. 21, Kebayoran Baru, Jakarta Selatan 12190" },
    { name: "Demo User", nik: "3174010101900001", phone: "+6281234567890", email: "user@konsera.test" },
    { status: "approved", submitted_at: "2026-11-17T09:30:00+07:00", reviewed_at: "2026-11-18T14:05:00+07:00" },
  ),
  application(
    5,
    { name: "Suara Senja Live", type: "company", city: "Semarang", address: "Jl. Pandanaran No. 50, Semarang Tengah 50134" },
    { name: "Wulan Sari", nik: "3374066707920004", phone: "+6282133345678", email: "wulan@suarasenja.id" },
    {
      status: "rejected",
      submitted_at: "2026-11-12T15:40:00+07:00",
      reviewed_at: "2026-11-13T10:20:00+07:00",
      rejection_reason: "The KTP photo is cut off, so the NIK cannot be read. Upload the whole card.",
    },
  ),
]);

// ---------------------------------------------------------------- events

const artist = (n: number, name: string, photo: string) => ({ id: fixtureId(2050 + n), name, image_url: unsplash(photo, 400, 400) });
const tier = (n: number, name: string, tier_type: string, price: number, available_quota: number, max_per_transaction = 6) => ({
  id: fixtureId(2070 + n), name, tier_type, price, available_quota, max_per_transaction,
});

const sunset = getOrganizerEventDetail("sunset-indie-picnic");
const midnight = getOrganizerEventDetail("midnight-rave-bandung");
const gelora = getEventBySlug("gelora-fest-2026");
if (!sunset || !midnight || !gelora) throw new Error("Missing fixture events for admin reviews");

const fromOrganizerEvent = (detail: NonNullable<typeof sunset>, extra: Record<string, unknown>) => ({
  event_id: detail.event.id,
  title: detail.event.title,
  organizer_name: "Nada Kota Productions",
  description: "An open-air afternoon of Bandung indie bands on the grass, with food stalls and a picnic area. All ages welcome.",
  poster_url: detail.event.poster_url,
  categories: detail.event.categories,
  venue: detail.event.venue,
  address: "Jl. Ambon No. 9, Citarum, Bandung Wetan, Bandung 40115",
  sessions: detail.sessions,
  tiers: detail.tiers,
  seat_map_url: detail.event.seat_map_url,
  is_resubmission: false,
  previous_rejection_reason: null,
  rejection_reason: null,
  decided_at: null,
  ...extra,
});

export const EVENT_REVIEWS = AdminEventReviewSchema.array().parse([
  fromOrganizerEvent(sunset, {
    permit: doc("izin-keramaian-sunset-indie-picnic.pdf", 1_240_000),
    status: "pending_review",
    submitted_at: "2026-11-17T16:20:00+07:00",
  }),
  {
    event_id: fixtureId(2001), title: "Coastline Acoustic Night", organizer_name: "Pesisir Live",
    description: "Stripped-back sets on the beach at sunset, with three acoustic acts and a small seated area at the front.",
    poster_url: unsplash("photo-1501386761578-eac5c94b800a", 800, 1000), categories: ["Acoustic", "Indie"],
    venue: {
      id: fixtureId(2011), name: "Mertasari Beach Stage", type: "outdoor", city: "Denpasar",
      latitude: -8.7136, longitude: 115.2541, total_capacity: 1200, timezone: "Asia/Makassar",
    },
    address: "Pantai Mertasari, Jl. Mertasari, Sanur Kauh, Denpasar Selatan 80227",
    sessions: [{
      id: fixtureId(2021), name: "Sunset set", start_at: "2027-01-30T19:00:00+08:00", end_at: "2027-01-30T22:30:00+08:00",
      artists: [artist(1, "Laut Biru", "photo-1459749411175-04bf5292ceea"), artist(2, "Kanaya", "photo-1470225620780-dba8ba36b745")],
    }],
    tiers: [tier(1, "Beach", "regular", 25, 900), tier(2, "Front Seats", "vip", 55, 120, 4)],
    seat_map_url: null, permit: doc("izin-keramaian-coastline-v2.pdf", 980_000),
    status: "pending_review", is_resubmission: true,
    previous_rejection_reason: "The permit was not signed by the venue manager.",
    rejection_reason: null, submitted_at: "2026-11-18T09:12:00+07:00", decided_at: null,
  },
  {
    event_id: fixtureId(2002), title: "Metro Bass Weekender", organizer_name: "Lowend Collective",
    description: "Two nights of bass music in a converted warehouse. 18+ only, ID checked at the door.",
    poster_url: unsplash("photo-1470225620780-dba8ba36b745", 800, 1000), categories: ["Electronic"],
    venue: {
      id: fixtureId(2012), name: "Gudang Metro", type: "indoor", city: "Surabaya",
      latitude: -7.2575, longitude: 112.7521, total_capacity: 2500, timezone: "Asia/Jakarta",
    },
    address: "Jl. Rajawali No. 47, Krembangan, Surabaya 60175",
    sessions: [
      {
        id: fixtureId(2022), name: "Night 1", start_at: "2027-02-13T21:00:00+07:00", end_at: "2027-02-14T03:00:00+07:00",
        artists: [artist(3, "Subsonic Tide", "photo-1470225620780-dba8ba36b745")],
      },
      {
        id: fixtureId(2023), name: "Night 2", start_at: "2027-02-14T21:00:00+07:00", end_at: "2027-02-15T03:00:00+07:00",
        artists: [artist(4, "DJ Arka", "photo-1501386761578-eac5c94b800a")],
      },
    ],
    tiers: [tier(3, "Early Bird", "early_bird", 30, 400), tier(4, "General", "regular", 45, 1800), tier(5, "Mezzanine", "vip", 90, 200, 4)],
    seat_map_url: null, permit: doc("izin-keramaian-metro-bass.pdf", 1_480_000),
    status: "pending_review", is_resubmission: false, previous_rejection_reason: null,
    rejection_reason: null, submitted_at: "2026-11-18T20:45:00+07:00", decided_at: null,
  },
  {
    event_id: fixtureId(2003), title: "Paduan Suara Kota", organizer_name: "Harmoni Nusantara",
    description: "A city choir evening with traditional songs in new arrangements. Seated concert hall, doors close at the start.",
    poster_url: unsplash("photo-1459749411175-04bf5292ceea", 800, 1000), categories: ["Classical"],
    venue: {
      id: fixtureId(2013), name: "Gedung Kesenian Sositet", type: "indoor", city: "Yogyakarta",
      latitude: -7.8003, longitude: 110.3650, total_capacity: 600, timezone: "Asia/Jakarta",
    },
    address: "Jl. Malioboro No. 1, Gondomanan, Yogyakarta 55122",
    sessions: [{
      id: fixtureId(2024), name: "Evening concert", start_at: "2027-03-06T18:30:00+07:00", end_at: "2027-03-06T21:00:00+07:00",
      artists: [artist(5, "Harmoni Nusantara Choir", "photo-1501386761578-eac5c94b800a")],
    }],
    tiers: [tier(6, "Balcony", "regular", 20, 350), tier(7, "Stalls", "vip", 40, 250, 4)],
    seat_map_url: null, permit: doc("surat-izin-gedung-sositet.pdf", 720_000),
    status: "pending_review", is_resubmission: false, previous_rejection_reason: null,
    rejection_reason: null, submitted_at: "2026-11-19T07:40:00+07:00", decided_at: null,
  },
  {
    event_id: gelora.id, title: gelora.title, organizer_name: "Nada Kota Productions", description: gelora.description,
    poster_url: gelora.poster_url, categories: gelora.categories, venue: gelora.venue,
    address: "Jl. Ambon No. 9, Citarum, Bandung Wetan, Bandung 40115",
    sessions: getEventSessions(gelora.id), tiers: getEventTicketTiers(gelora.id), seat_map_url: gelora.seat_map_url,
    permit: doc("izin-keramaian-gelora-fest-2026.pdf", 1_620_000),
    status: "approved", is_resubmission: false, previous_rejection_reason: null, rejection_reason: null,
    submitted_at: "2026-11-05T10:00:00+07:00", decided_at: "2026-11-06T09:30:00+07:00",
  },
  fromOrganizerEvent(midnight, {
    description: "An all-night rave in Bandung with three resident DJs.",
    permit: doc("izin-keramaian-midnight-rave.pdf", 1_100_000),
    status: "rejected",
    rejection_reason: midnight.event.rejection_reason,
    submitted_at: "2026-11-14T11:00:00+07:00",
    decided_at: "2026-11-15T13:10:00+07:00",
  }),
]);
