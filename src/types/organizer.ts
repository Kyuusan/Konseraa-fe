import { z } from "zod";
import { ConcertEventSchema } from "./event";

// Organizer shape follows openapi-spec.yaml (id, company_name, verification_status).
// Everything marked "not in spec" comes from the agreed verification flow and the
// organizers / organizer_verifications tables in PRD §4; confirm with backend.

export const ORGANIZER_VERIFICATION_STATUSES = ["pending", "in_review", "approved", "rejected"] as const;
export type OrganizerVerificationStatus = (typeof ORGANIZER_VERIFICATION_STATUSES)[number];

/** Not in spec. */
export const ORGANIZER_TYPES = ["individual", "company"] as const;
export type OrganizerType = (typeof ORGANIZER_TYPES)[number];

export const OrganizerSchema = z.object({
  id: z.uuid(),
  company_name: z.string(),
  verification_status: z.enum(ORGANIZER_VERIFICATION_STATUSES),
  /** Not in spec. */
  organizer_type: z.enum(ORGANIZER_TYPES),
  /** Not in spec. */
  city: z.string(),
  /** Not in spec. */
  address: z.string(),
});
export type Organizer = z.infer<typeof OrganizerSchema>;

/** Not in spec: the person accountable for the organizer (KYC). */
export const PersonInChargeSchema = z.object({
  full_name: z.string().trim().min(1, "Enter the full name on the ID card."),
  nik: z.string().regex(/^\d{16}$/, "The NIK is the 16-digit number on the ID card."),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Enter a phone number with 9–15 digits."),
  email: z.email("Enter a valid email address."),
});
export type PersonInCharge = z.infer<typeof PersonInChargeSchema>;

/** Not in spec: metadata of an uploaded document. */
export const DocumentFileSchema = z.object({
  name: z.string(),
  size: z.int().nonnegative(),
  mime_type: z.string(),
});
export type DocumentFile = z.infer<typeof DocumentFileSchema>;

/** Not in spec: one submission in organizer_verifications (an organizer can resubmit). */
export const OrganizerVerificationSchema = z.object({
  id: z.uuid(),
  organizer_id: z.uuid(),
  status: z.enum(ORGANIZER_VERIFICATION_STATUSES),
  person_in_charge: PersonInChargeSchema,
  id_card: DocumentFileSchema,
  business_document: DocumentFileSchema.nullable(),
  submitted_at: z.iso.datetime({ offset: true }),
  reviewed_at: z.iso.datetime({ offset: true }).nullable(),
  rejection_reason: z.string().nullable(),
});
export type OrganizerVerification = z.infer<typeof OrganizerVerificationSchema>;

/** Not in spec: the "become an organizer" form, derived from the shapes above. */
export const OrganizerApplicationSchema = OrganizerSchema.pick({ organizer_type: true })
  .extend({
    company_name: z.string().trim().min(2, "Enter the organizer name."),
    city: z.string().trim().min(2, "Enter the city."),
    address: z.string().trim().min(10, "Enter the full address."),
    person_in_charge: PersonInChargeSchema,
    id_card: DocumentFileSchema.nullable().refine(Boolean, "Upload the ID card (KTP) of the person in charge."),
    business_document: DocumentFileSchema.nullable(),
    declaration: z.literal(true, "Confirm that the data is correct."),
  });
export type OrganizerApplication = z.infer<typeof OrganizerApplicationSchema>;

/** Not in spec: a row of the organizer's own events, with its sales so far. */
export const OrganizerEventSchema = ConcertEventSchema.extend({
  tickets_sold: z.int().nonnegative(),
  ticket_capacity: z.int().positive(),
  gross_revenue: z.number().nonnegative(),
  rejection_reason: z.string().nullable(),
  updated_at: z.iso.datetime({ offset: true }),
});
export type OrganizerEvent = z.infer<typeof OrganizerEventSchema>;

/** Not in spec: a paid booking on one of the organizer's events (fed by event:ticket:sold). */
export const OrganizerSaleSchema = z.object({
  booking_code: z.string(),
  buyer_name: z.string(),
  event_title: z.string(),
  tier_name: z.string(),
  quantity: z.int().positive(),
  total_amount: z.number().nonnegative(),
  paid_at: z.iso.datetime({ offset: true }),
});
export type OrganizerSale = z.infer<typeof OrganizerSaleSchema>;
