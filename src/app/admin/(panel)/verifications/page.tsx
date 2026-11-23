import { VERIFICATIONS } from "@/__fixtures__/adminReviews";
import { VerificationReviews } from "@/components/adminComponent/reviews/verificationReviews";
import { param } from "@/components/userComponent/checkout/checkoutParams";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const review = param(await searchParams, "review");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Organizer verifications"
        description="Check who is behind each organizer before they can sell tickets. Approving unlocks their organizer tools."
      />
      <VerificationReviews items={VERIFICATIONS} initialOpenId={review} />
    </div>
  );
}
