import { EVENTS } from "@/__fixtures__/events";
import { getOrganizerEventDetail } from "@/__fixtures__/organizerEvents";
import { getVenueLayout } from "@/__fixtures__/venueLayouts";
import { EventWizard } from "@/components/organizerComponent/eventWizard/eventWizard";
import { emptyValues, valuesFromDraft } from "@/components/organizerComponent/eventWizard/wizardValues";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  await requireApprovedOrganizer();
  const draftSlug = param(await searchParams, "draft");
  // Drafts and rejected events reopen in the wizard; anything else starts a new event.
  const detail = draftSlug ? getOrganizerEventDetail(draftSlug) : undefined;
  const draft = detail && ["draft", "rejected"].includes(detail.event.status) ? detail.event : undefined;
  const resubmit = draft?.status === "rejected";
  const categories = [...new Set(EVENTS.flatMap((event) => event.categories))].toSorted();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={resubmit ? "Fix and resubmit" : draft ? "Continue draft" : "New event"}
        title={draft ? draft.title : "Create event"}
        description="Fill in five short steps. Your event is reviewed before it goes on sale."
        actions={
          <ButtonLink href={resubmit ? `/organizer/events/${draft.slug}` : "/organizer/events"} variant="outline" className="rounded-full">
            Cancel
          </ButtonLink>
        }
      />
      {resubmit && (
        <div role="alert" className="rounded-[20px] border border-danger/40 bg-danger/10 p-5">
          <p className="text-xs font-semibold tracking-widest text-danger uppercase">Reason from the reviewer</p>
          <p className="mt-2">{draft.rejection_reason}</p>
        </div>
      )}
      <EventWizard key={draft?.slug ?? "new"} initial={draft && detail ? valuesFromDraft(draft, detail.sessions, detail.tiers, getVenueLayout(draft.venue.id)) : emptyValues()} categories={categories} />
    </div>
  );
}
