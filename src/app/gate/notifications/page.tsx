import { getNotifications } from "@/__fixtures__/notifications";
import { NotificationCenter } from "@/components/accountComponent/notificationCenter";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Gate" title="Notifications" description="New assignments and gate opening times." />
      <NotificationCenter notifications={getNotifications("gatekeeper")} />
    </div>
  );
}
