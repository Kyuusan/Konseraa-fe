import { getOrganizerEvents } from "@/__fixtures__/organizerEvents";
import { EventsByStatus } from "@/components/organizerComponent/events/eventsByStatus";
import { toStatusFilter } from "@/components/organizerComponent/events/statusFilters";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  await requireApprovedOrganizer();
  const initialStatus = toStatusFilter(param(await searchParams, "status"));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organizer"
        title="My events"
        description="Every event you created, from drafts to finished shows."
        actions={
          <ButtonLink href="/organizer/events/new" hoverScale={1.02} className="h-11 rounded-full px-5 font-semibold">
            Create event
          </ButtonLink>
        }
      />
      <EventsByStatus events={getOrganizerEvents()} initialStatus={initialStatus} />
    </div>
  );
}
