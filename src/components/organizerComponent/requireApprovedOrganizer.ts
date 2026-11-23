import { redirect } from "next/navigation";
import { getCurrentOrganizer } from "@/__fixtures__/session";

/** For organizer tool pages: anyone not yet approved is sent back to the onboarding page. */
export async function requireApprovedOrganizer() {
  const data = await getCurrentOrganizer();
  if (!data || data.organizer.verification_status !== "approved") redirect("/organizer");
  return data;
}
