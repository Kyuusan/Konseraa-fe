import { getGatekeeperOrganizerName } from "@/__fixtures__/gatekeepers";
import { NotificationPreferencesForm } from "@/components/accountComponent/notificationPreferencesForm";
import { PasswordForm } from "@/components/accountComponent/passwordForm";
import { ProfileSummary } from "@/components/accountComponent/profileSummary";
import { getGateSessions } from "@/components/gateComponent/gateSessions";
import { requireGatekeeper } from "@/components/gateComponent/requireGatekeeper";
import { FormSection } from "@/components/organizerComponent/onboarding/formSection";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default async function Page() {
  const gatekeeper = await requireGatekeeper();
  const events = [...new Set(getGateSessions(gatekeeper).map((session) => session.event_title))];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Gate" title="Profile" description="Your gate account. Your organizer manages your details and events." />
      <ProfileSummary name={gatekeeper.full_name} email={gatekeeper.email} roles={["Gatekeeper"]} memberSince={gatekeeper.created_at} />

      <FormSection id="account-heading" title="Account" description="Ask your organizer to change any of this.">
        <dl className="divide-y divide-text-primary/10 text-sm">
          <div className="flex justify-between gap-4 pb-3">
            <dt className="text-text-primary/70">Organizer</dt>
            <dd className="text-right font-medium">{getGatekeeperOrganizerName(gatekeeper)}</dd>
          </div>
          <div className="flex justify-between gap-4 pt-3">
            <dt className="text-text-primary/70">Events you scan</dt>
            <dd className="text-right font-medium">{events.join(", ") || "None yet"}</dd>
          </div>
        </dl>
      </FormSection>

      <FormSection
        id="password-heading"
        title="Password"
        description="Replace the temporary password your organizer gave you with one only you know."
      >
        <PasswordForm submitLabel="Set new password" />
      </FormSection>

      <FormSection id="channels-heading" title="Notifications" description="We tell you when you are assigned to an event and before the gate opens.">
        <NotificationPreferencesForm initial={{ notify_push: true, notify_email: true, notify_sms: false }} />
      </FormSection>
    </div>
  );
}
