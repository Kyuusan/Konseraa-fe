// Dummy stand-in for the signed-in session and GET /organizer profile + latest
// verification. Reads the demo cookies so every onboarding state can be tried.
import { cookies } from "next/headers";
import { AccountOwnerSchema, OrganizerSchema, OrganizerVerificationSchema } from "@/types/organizer";
import { SessionSchema, UserSchema } from "@/types/user";
import {
  DEMO_APPLICATION_COOKIE,
  DEMO_FAVORITES_COOKIE,
  DEMO_GATEKEEPER_COOKIE,
  DEMO_ORGANIZER_STATES,
  DEMO_STATE_COOKIE,
  type DemoApplicationSummary,
  type DemoOrganizerState,
  parseFavoriteIds,
} from "./demoState";
import { getGatekeeper } from "./gatekeepers";
import { fixtureId } from "./ids";

const ORGANIZER_ID = fixtureId(1200);

const DEMO_USER = UserSchema.parse({
  id: fixtureId(1300),
  email: "user@konsera.test",
  phone: "+6281234567890",
  status: "active",
  full_name: "Demo User",
  avatar_url: "",
  created_at: "2026-09-01T10:00:00+07:00",
});

const DEFAULT_APPLICATION: DemoApplicationSummary = {
  company_name: "Nada Kota Productions",
  legal_entity_type: "company",
};

function parseApplication(raw: string | undefined): DemoApplicationSummary {
  if (!raw) return DEFAULT_APPLICATION;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    return typeof parsed === "object" && parsed !== null ? { ...DEFAULT_APPLICATION, ...parsed } : DEFAULT_APPLICATION;
  } catch {
    return DEFAULT_APPLICATION;
  }
}

async function readDemo() {
  const store = await cookies();
  const raw = store.get(DEMO_STATE_COOKIE)?.value;
  const state: DemoOrganizerState = DEMO_ORGANIZER_STATES.find((item) => item === raw) ?? "none";
  return { state, application: parseApplication(store.get(DEMO_APPLICATION_COOKIE)?.value) };
}

/** Event ids the demo user saved (favorites). */
export async function getSavedEventIds() {
  const store = await cookies();
  return parseFavoriteIds(store.get(DEMO_FAVORITES_COOKIE)?.value);
}

/** The signed-in gatekeeper, or null. Disabled accounts count as signed out. */
export async function getCurrentGatekeeper() {
  const store = await cookies();
  const id = store.get(DEMO_GATEKEEPER_COOKIE)?.value;
  const gatekeeper = id ? getGatekeeper(decodeURIComponent(id)) : undefined;
  return gatekeeper?.status === "active" ? gatekeeper : null;
}

export async function getCurrentSession() {
  const gatekeeper = await getCurrentGatekeeper();
  if (gatekeeper) {
    return SessionSchema.parse({
      user: { ...DEMO_USER, id: gatekeeper.id, email: gatekeeper.email, full_name: gatekeeper.full_name },
      roles: ["gatekeeper"],
      organizer_id: gatekeeper.organizer_id,
    });
  }

  const { state } = await readDemo();
  return SessionSchema.parse({
    user: DEMO_USER,
    roles: state === "approved" ? ["customer", "organizer"] : ["customer"],
    organizer_id: state === "none" ? null : ORGANIZER_ID,
  });
}

/**
 * The current user's organizer profile, its documents (one organizer_verifications row
 * each) and the review summary the status page needs, or null if they never applied.
 */
export async function getCurrentOrganizer() {
  const { state, application } = await readDemo();
  if (state === "none") return null;

  const organizer = OrganizerSchema.parse({
    id: ORGANIZER_ID,
    company_name: application.company_name,
    verification_status: state,
    legal_entity_type: application.legal_entity_type,
  });

  const submittedAt = "2026-11-17T09:30:00+07:00";
  const reviewedAt = state === "approved" || state === "rejected" ? "2026-11-18T14:05:00+07:00" : null;
  const rejectionReason =
    state === "rejected" ? "The ID card photo is blurry, so the name cannot be read. Please upload a clearer photo." : null;

  const documents = OrganizerVerificationSchema.array().parse([
    {
      id: fixtureId(1201), organizer_id: ORGANIZER_ID, document_type: "id_card",
      document_url: "https://files.konsera.id/organizers/ktp-demo-user.jpg",
      status: state, reviewed_at: reviewedAt, rejection_reason: rejectionReason, created_at: submittedAt,
    },
    ...(application.legal_entity_type === "company"
      ? [{
          id: fixtureId(1202), organizer_id: ORGANIZER_ID, document_type: "business_license",
          document_url: "https://files.konsera.id/organizers/nib-nada-kota.pdf",
          status: state === "rejected" ? "approved" : state, reviewed_at: reviewedAt, rejection_reason: null, created_at: submittedAt,
        }]
      : []),
  ]);

  const owner = AccountOwnerSchema.parse({ full_name: DEMO_USER.full_name, email: DEMO_USER.email, phone: DEMO_USER.phone });

  return {
    organizer,
    owner,
    documents,
    review: { submitted_at: submittedAt, reviewed_at: reviewedAt, rejection_reason: rejectionReason },
    application,
  };
}
