import { getNotifications } from "@/__fixtures__/notifications";
import { getCurrentSession } from "@/__fixtures__/session";
import { NotificationCenter } from "@/components/accountComponent/notificationCenter";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  const session = await getCurrentSession();
  const isOrganizer = session.roles.includes("organizer");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Notifications"
        description={isOrganizer ? "Your bookings and your events as an organizer, in one place." : "Bookings, reminders and updates on your events."}
      />
      <NotificationCenter notifications={getNotifications(isOrganizer ? "organizer" : "customer")} />
    </div>
  );
}
