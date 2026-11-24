import { EVENTS } from "@/__fixtures__/events";
import { getSavedEventIds } from "@/__fixtures__/session";
import { SavedEvents } from "@/components/userComponent/saved/savedEvents";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  const ids = await getSavedEventIds();
  // Only the saved events go to the browser; un-saving here just hides them.
  const events = EVENTS.filter((event) => ids.includes(event.id));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Explore" title="Saved events" description="Shows you want to keep an eye on." />
      <SavedEvents events={events} initialIds={ids} />
    </div>
  );
}
