import { redirect } from "next/navigation";
import { getCurrentOrganizer, getCurrentSession } from "@/__fixtures__/session";
import { ApplicationForm } from "@/components/organizerComponent/onboarding/applicationForm";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  const data = await getCurrentOrganizer();
  const { user } = await getCurrentSession();
  const status = data?.organizer.verification_status;
  // Only first-time applicants and rejected applications can (re)submit.
  if (status && status !== "rejected") redirect("/organizer");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={status === "rejected" ? "Resubmit application" : "Become an organizer"}
        title="Organizer verification"
        description="We check who is behind every event before tickets go on sale. This takes one form."
        actions={
          <ButtonLink href="/organizer" variant="outline" className="rounded-full">
            Back
          </ButtonLink>
        }
      />
      <ApplicationForm
        initial={data?.application}
        owner={{ full_name: user.full_name, email: user.email, phone: user.phone || null }}
      />
    </div>
  );
}
