import { HelpFaq } from "@/components/organizerComponent/help/helpFaq";
import { requireApprovedOrganizer } from "@/components/organizerComponent/requireApprovedOrganizer";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  await requireApprovedOrganizer();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Organizer" title="Help" description="Answers to what organizers ask most." />
      <HelpFaq />
    </div>
  );
}
