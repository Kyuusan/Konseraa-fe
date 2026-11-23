import { getCurrentGatekeeper } from "@/__fixtures__/session";
import { getGateSessions } from "./gateSessions";

/**
 * The gatekeeper's sessions and the one picked in `?session=`. Without a valid
 * choice, the next session that has not closed yet is used (or the last one).
 */
export async function resolveGateSession(requested: string | undefined) {
  const gatekeeper = await getCurrentGatekeeper();
  const sessions = gatekeeper ? getGateSessions(gatekeeper) : [];
  const now = Date.now();
  const session =
    sessions.find((item) => item.id === requested) ??
    sessions.find((item) => Date.parse(item.gate_closes_at) >= now) ??
    sessions.at(-1);
  return { sessions, session };
}
