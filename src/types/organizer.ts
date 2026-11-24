import { z } from "zod";
import { ConcertEventSchema } from "./event";

// Shapes follow the backend models (organizers, organizer_verifications). Fields the
// backend does not store (city, address, person-in-charge NIK) were removed: the
// person in charge is the account owner (organizers.user_id).

export const ORGANIZER_VERIFICATION_STATUSES = ["pending", "in_review", "approved", "rejected"] as const;
export type OrganizerVerificationStatus = (typeof ORGANIZER_VERIFICATION_STATUSES)[number];

/** organizers.legal_entity_type (a free string in the backend; these are the values the UI offers). */
export const LEGAL_ENTITY_TYPES = ["individual", "company"] as const;
export type LegalEntityType = (typeof LEGAL_ENTITY_TYPES)[number];

export const OrganizerSchema = z.object({
  id: z.uuid(),
  company_name: z.string(),
  verification_status: z.enum(ORGANIZER_VERIFICATION_STATUSES),
  legal_entity_type: z.enum(LEGAL_ENTITY_TYPES),
});
export type Organizer = z.infer<typeof OrganizerSchema>;

/** The account behind an organizer (users + user_profiles), shown as the person in charge. */
export const AccountOwnerSchema = z.object({
  full_name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
});
export type AccountOwner = z.infer<typeof AccountOwnerSchema>;

/** A picked file before upload; the backend stores only its document_url. */
export const DocumentFileSchema = z.object({
  name: z.string(),
  size: z.int().nonnegative(),
  mime_type: z.string(),
});
export type DocumentFile = z.infer<typeof DocumentFileSchema>;

/** organizer_verifications.document_type values the UI uploads. */
export const DOCUMENT_TYPES = ["id_card", "business_license"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  id_card: "ID card (KTP)",
  business_license: "NIB or deed of establishment",
};

/** One row of organizer_verifications: one uploaded document and its review. */
export const OrganizerVerificationSchema = z.object({
  id: z.uuid(),
  organizer_id: z.uuid(),
  document_type: z.enum(DOCUMENT_TYPES),
  document_url: z.string(),
  status: z.enum(ORGANIZER_VERIFICATION_STATUSES),
  reviewed_at: z.iso.datetime({ offset: true }).nullable(),
  rejection_reason: z.string().nullable(),
  created_at: z.iso.datetime({ offset: true }),
});
export type OrganizerVerification = z.infer<typeof OrganizerVerificationSchema>;

/** The "become an organizer" form: only what organizers and organizer_verifications store. */
export const OrganizerApplicationSchema = z.object({
  legal_entity_type: z.enum(LEGAL_ENTITY_TYPES),
  company_name: z.string().trim().min(2, "Enter the organizer name."),
  id_card: DocumentFileSchema.nullable().refine(Boolean, "Upload the ID card (KTP) of the account owner."),
  business_license: DocumentFileSchema.nullable(),
  declaration: z.literal(true, "Confirm that the data is correct."),
});
export type OrganizerApplication = z.infer<typeof OrganizerApplicationSchema>;

/** File name from a stored document URL, for display. */
export const documentName = (url: string) => decodeURIComponent(url.split("/").at(-1) ?? url);

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
