import { getGatekeepers } from "@/__fixtures__/gatekeepers";
import { getOrganizerEvents } from "@/__fixtures__/organizerEvents";
import { GatekeeperManager } from "@/components/organizerComponent/gatekeepers/gatekeeperManager";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

/** Gate staff are only needed for events that will still take place. */
const ASSIGNABLE = ["published", "ongoing", "approved", "pending_review"];

export default async function Page() {
  const { organizer } = await requireApprovedOrganizer();
  const events = getOrganizerEvents();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organizer"
        title="Gatekeepers"
        description="Accounts for the people scanning tickets at your gates. They only see the scanner and the visitor count of the events you assign."
      />
      <GatekeeperManager
        organizerId={organizer.id}
        gatekeepers={getGatekeepers()}
        assignableEvents={events.filter((event) => ASSIGNABLE.includes(event.status)).map(({ id, title }) => ({ id, title }))}
        eventTitles={Object.fromEntries(events.map((event) => [event.id, event.title]))}
      />
    </div>
  );
}
