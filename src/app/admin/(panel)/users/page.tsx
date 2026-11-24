import { ADMIN_USERS } from "@/__fixtures__/adminUsers";
import { UserManager } from "@/components/adminComponent/users/userManager";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default function Page() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Everyone with a Konsera account. Suspend or ban accounts that break the rules; organizer approval happens under Verifications."
      />
      <UserManager users={ADMIN_USERS} />
    </div>
  );
}
