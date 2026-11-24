import { getModerationQueue } from "@/__fixtures__/reviews";
import { ReviewModeration } from "@/components/adminComponent/reviews/reviewModeration";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default function Page() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Reviews"
        description="Hide reviews that break the rules, such as spam, ticket reselling or abuse. Hidden reviews leave the event page and can be restored."
      />
      <ReviewModeration items={getModerationQueue()} />
    </div>
  );
}
