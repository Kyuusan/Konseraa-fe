// Dummy gatekeeper accounts of the demo organizer (no endpoint in the spec yet).
// In the demo, signing in at /login with one of these emails opens the gate area.
import { GatekeeperSchema, type Gatekeeper } from "@/types/gatekeeper";
import { fixtureId } from "./ids";

const ORGANIZER_ID = fixtureId(1200);

export const GATEKEEPERS: Gatekeeper[] = GatekeeperSchema.array().parse([
  {
    id: fixtureId(1701), organizer_id: ORGANIZER_ID, full_name: "Bima Saputra", email: "bima.gate@konsera.test", status: "active",
    event_ids: [fixtureId(1)], last_active_at: "2026-11-18T19:40:00+07:00", created_at: "2026-11-02T10:00:00+07:00",
  },
  {
    id: fixtureId(1702), organizer_id: ORGANIZER_ID, full_name: "Rina Kusuma", email: "rina.gate@konsera.test", status: "active",
    event_ids: [fixtureId(1), fixtureId(2)], last_active_at: "2026-11-17T21:05:00+07:00", created_at: "2026-11-02T10:05:00+07:00",
  },
  {
    id: fixtureId(1703), organizer_id: ORGANIZER_ID, full_name: "Yoga Pratama", email: "yoga.gate@konsera.test", status: "disabled",
    event_ids: [fixtureId(8)], last_active_at: "2026-10-17T22:10:00+07:00", created_at: "2026-09-20T09:00:00+07:00",
  },
]);

export const getGatekeepers = () => GATEKEEPERS;
export const findGatekeeperByEmail = (email: string) =>
  GATEKEEPERS.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
export const getGatekeeper = (id: string) => GATEKEEPERS.find((item) => item.id === id);

/** Name of the organizer a gatekeeper works for (every fixture gatekeeper is the demo organizer's). */
export const getGatekeeperOrganizerName = (gatekeeper: Gatekeeper) =>
  gatekeeper.organizer_id === ORGANIZER_ID ? "Nada Kota Productions" : "Your organizer";
