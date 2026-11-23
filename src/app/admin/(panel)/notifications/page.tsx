import { getNotifications } from "@/__fixtures__/notifications";
import { NotificationCenter } from "@/components/accountComponent/notificationCenter";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default function Page() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader eyebrow="Admin" title="Notifications" description="New reviews, applications, payouts and refunds." />
      <NotificationCenter notifications={getNotifications("admin")} />
    </div>
  );
}
