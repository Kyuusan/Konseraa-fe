import { z } from "zod";

export const USER_STATUSES = ["active", "suspended", "banned", "pending_verification"] as const;

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  phone: z.string(),
  status: z.enum(USER_STATUSES),
  full_name: z.string(),
  avatar_url: z.string(),
  created_at: z.iso.datetime({ offset: true }),
});
export type User = z.infer<typeof UserSchema>;

/** RBAC roles from PRD §3A. */
export const USER_ROLES = ["super_admin", "admin_event", "organizer", "customer", "gatekeeper"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Not in spec: what the signed-in session exposes to the frontend. One login
 * serves customers, organizers and gatekeepers; roles and organizer_id decide
 * which area the user lands in and what they can open.
 */
export const SessionSchema = z.object({
  user: UserSchema,
  roles: z.array(z.enum(USER_ROLES)),
  /** The organizer profile this user owns (organizer) or works the gate for (gatekeeper). */
  organizer_id: z.uuid().nullable(),
});
export type Session = z.infer<typeof SessionSchema>;

/** favorite_genres of PUT /users/me/preferences (in spec); drives "Recommended for you". */
export const FavoriteGenresSchema = z.object({
  favorite_genres: z.array(z.string()).min(1, "Pick at least one genre.").max(10, "Pick up to 10 genres."),
});
export type FavoriteGenres = z.infer<typeof FavoriteGenresSchema>;
