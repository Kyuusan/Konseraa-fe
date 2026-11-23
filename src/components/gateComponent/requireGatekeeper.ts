import { redirect } from "next/navigation";
import { getCurrentGatekeeper } from "@/__fixtures__/session";

/** The gate area is only for signed-in, active gatekeepers. */
export async function requireGatekeeper() {
  const gatekeeper = await getCurrentGatekeeper();
  if (!gatekeeper) redirect("/login");
  return gatekeeper;
}
