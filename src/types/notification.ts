import { z } from "zod";

// Not in spec: the spec has no notification endpoints or schema. This mirrors the
// notifications table (PRD §6) and the `notification:new` socket payload (PRD §5).

export const NOTIFICATION_TYPES = ["booking", "event", "organizer", "payout", "gate", "review", "system"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NotificationSchema = z.object({
  id: z.uuid(),
  type: z.enum(NOTIFICATION_TYPES),
  title: z.string(),
  body: z.string(),
  /** Where the notification leads, if anywhere. */
  link: z.string().nullable(),
  is_read: z.boolean(),
  created_at: z.iso.datetime({ offset: true }),
});
export type AppNotification = z.infer<typeof NotificationSchema>;

/** Channel switches from PUT /users/me/preferences (in spec). */
export const NotificationPreferencesSchema = z.object({
  notify_push: z.boolean(),
  notify_email: z.boolean(),
  notify_sms: z.boolean(),
});
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;

export const PasswordChangeSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password."),
    new_password: z.string().min(8, "Use at least 8 characters."),
    confirm_password: z.string(),
  })
  .refine((value) => value.new_password !== value.current_password, {
    path: ["new_password"],
    message: "Choose a password you have not used here.",
  })
  .refine((value) => value.confirm_password === value.new_password, {
    path: ["confirm_password"],
    message: "The passwords do not match.",
  });
export type PasswordChange = z.infer<typeof PasswordChangeSchema>;

export const ProfileDetailsSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name."),
  phone: z.string().trim().regex(/^\+?[0-9 ]{8,16}$/, "Enter a valid phone number."),
});
export type ProfileDetails = z.infer<typeof ProfileDetailsSchema>;
