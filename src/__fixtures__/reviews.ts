// Dummy reviews (no review endpoint in the spec yet). Reviews belong to a show that
// has ended (PRD §F); upcoming events show the reviews of their previous edition.
import { PastShowReviewsSchema, ReviewSchema, type ConcertEvent, type PastShowReviews, type Review } from "@/types/event";
import { getEventReviews } from "./events";
import { fixtureId, unsplash } from "./ids";
import { TICKETS } from "./tickets";

let next = 2600;
const review = (user_full_name: string, rating: number, comment: string, created_at: string, photos: string[] = []) => ({
  id: fixtureId(next++),
  user_full_name,
  rating,
  comment,
  photo_urls: photos.map((photo) => unsplash(photo, 1200, 1200)),
  created_at,
});

const CROWD = "photo-1459749411175-04bf5292ceea";
const LIGHTS = "photo-1470225620780-dba8ba36b745";
const STAGE = "photo-1501386761578-eac5c94b800a";

/** More reviews for Echoes in Bloom, on top of the three in events.ts. */
const MORE_ECHOES = ReviewSchema.array().parse([
  review("Kevin H.", 4, "The new songs sound even bigger live. Merch line was long, so go early.", "2026-10-20T11:30:00+07:00", [CROWD]),
  review("Ayu P.", 5, "Perfect setlist and the lights during the last song were unreal.", "2026-10-21T08:15:00+07:00", [LIGHTS, STAGE]),
  review("Daniel K.", 3, "Good band, but the sound at the back of the hall was muddy.", "2026-10-22T19:45:00+07:00"),
]);

const PAST_SHOWS: Record<string, unknown> = {
  [fixtureId(1)]: {
    show_title: "Neon Arcadia Tour, Bandung", show_date: "2025-08-16T20:00:00+07:00",
    reviews: [
      review("Rizky A.", 5, "Synths, lasers and a crowd that sang every word. Worth the trip from Jakarta.", "2025-08-17T10:00:00+07:00", [LIGHTS, CROWD, STAGE]),
      review("Putri A.", 4, "Great energy. The VIP area got crowded near the end.", "2025-08-18T14:20:00+07:00"),
      review("Fajar N.", 5, "Tightest live band I've seen. Already bought tickets for this one.", "2025-08-19T09:05:00+07:00"),
    ],
  },
  [fixtureId(2)]: {
    show_title: "Gelora Fest 2025", show_date: "2025-12-13T15:00:00+07:00",
    reviews: [
      review("Sinta M.", 5, "Two stages of local bands and the food court was great. Bring a raincoat.", "2025-12-15T12:00:00+07:00", [CROWD]),
      review("Bayu S.", 4, "Line-up was strong. Getting out after the last act took a while.", "2025-12-15T18:40:00+07:00"),
    ],
  },
  [fixtureId(3)]: {
    show_title: "Low Tide Sessions Vol. 2", show_date: "2026-05-09T19:30:00+07:00",
    reviews: [
      review("Laras W.", 5, "Small room, warm sound, and the trio played two encores.", "2026-05-10T09:00:00+07:00"),
      review("Mei L.", 4, "Lovely evening. Front tables are worth the extra.", "2026-05-11T16:30:00+07:00"),
    ],
  },
  [fixtureId(4)]: {
    show_title: "Paper Satellites, Kuala Lumpur", show_date: "2025-11-22T20:00:00+08:00",
    reviews: [
      review("Hendra S.", 5, "Loud in the best way. The stadium sound was clearer than I expected.", "2025-11-23T11:10:00+08:00"),
      review("Naya P.", 4, "Great show, long walk from the train station though.", "2025-11-24T08:45:00+08:00"),
    ],
  },
  [fixtureId(5)]: {
    show_title: "Seoul Afterglow 2025", show_date: "2025-10-11T18:00:00+09:00",
    reviews: [
      review("Mei L.", 5, "Every group sounded live, not just playback. The fan chants were so loud.", "2025-10-12T10:20:00+09:00", [STAGE, LIGHTS]),
      review("Andi R.", 4, "Amazing staging. Floor tickets give the best view of the walkway.", "2025-10-13T21:00:00+09:00"),
      review("Wulan S.", 5, "Soundcheck pass was worth it, we heard two songs they didn't play later.", "2025-10-14T13:15:00+09:00"),
    ],
  },
  [fixtureId(6)]: {
    show_title: "Harbour Lights Spring Concert", show_date: "2026-04-18T18:30:00+09:00",
    reviews: [
      review("Kevin H.", 5, "The jazz arrangements of the classical pieces were beautiful.", "2026-04-19T09:40:00+09:00"),
      review("Ayu P.", 4, "Balcony seats have a great view but get warm.", "2026-04-20T17:00:00+09:00"),
    ],
  },
  [fixtureId(7)]: {
    show_title: "Bass Assembly NYE 2025", show_date: "2025-12-31T20:00:00+08:00",
    reviews: [
      review("Bayu S.", 5, "The countdown on the cliff deck is something else.", "2026-01-01T13:00:00+08:00"),
      review("Daniel K.", 3, "Great DJs, but the shuttle back to town was a mess.", "2026-01-02T10:30:00+08:00"),
    ],
  },
};

/** Reviews of this show, as GET /events/{id}/reviews would return them (newest first). */
export function getShowReviews(event: ConcertEvent): Review[] {
  const extra = event.slug === "echoes-in-bloom" ? MORE_ECHOES : [];
  return [...getEventReviews(event.id), ...extra].toSorted((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export function getPastShowReviews(event: ConcertEvent): PastShowReviews | null {
  const raw = PAST_SHOWS[event.id];
  return raw ? PastShowReviewsSchema.parse(raw) : null;
}

/** Only attendees review (PRD §F): the demo user's checked-in ticket is the proof. */
export const canReviewEvent = (event: ConcertEvent) =>
  event.status === "completed" && TICKETS.some((ticket) => ticket.event_slug === event.slug && ticket.status === "checked_in");
