// Dummy stand-in for the signed-in session and GET /organizer profile + latest
// verification. Reads the demo cookies so every onboarding state can be tried.
import { cookies } from "next/headers";
import { OrganizerSchema, OrganizerVerificationSchema } from "@/types/organizer";
import { SessionSchema, UserSchema } from "@/types/user";
import {
  DEMO_APPLICATION_COOKIE,
  DEMO_GATEKEEPER_COOKIE,
  DEMO_ORGANIZER_STATES,
  DEMO_STATE_COOKIE,
  type DemoApplicationSummary,
  type DemoOrganizerState,
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
  organizer_type: "company",
  city: "Jakarta",
  address: "Jl. Senopati No. 21, Kebayoran Baru, Jakarta Selatan",
  pic_name: "Demo User",
  pic_email: "user@konsera.test",
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

/** The current user's organizer profile and latest verification, or null if they never applied. */
export async function getCurrentOrganizer() {
  const { state, application } = await readDemo();
  if (state === "none") return null;

  const organizer = OrganizerSchema.parse({
    id: ORGANIZER_ID,
    company_name: application.company_name,
    verification_status: state,
    organizer_type: application.organizer_type,
    city: application.city,
    address: application.address,
  });

  const verification = OrganizerVerificationSchema.parse({
    id: fixtureId(1201),
    organizer_id: ORGANIZER_ID,
    status: state,
    person_in_charge: {
      full_name: application.pic_name,
      nik: "3174010101900001",
      phone: "+6281234567890",
      email: application.pic_email,
    },
    id_card: { name: "ktp-pic.jpg", size: 412_000, mime_type: "image/jpeg" },
    business_document: application.organizer_type === "company"
      ? { name: "nib-nada-kota.pdf", size: 820_000, mime_type: "application/pdf" }
      : null,
    submitted_at: "2026-11-17T09:30:00+07:00",
    reviewed_at: state === "approved" || state === "rejected" ? "2026-11-18T14:05:00+07:00" : null,
    rejection_reason:
      state === "rejected"
        ? "The ID card photo is blurry, so the NIK cannot be read. Please upload a clearer photo."
        : null,
  });

  return { organizer, verification, application };
}
