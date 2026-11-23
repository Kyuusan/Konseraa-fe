import { ADMIN_USER } from "@/__fixtures__/admin";
import { NotificationPreferencesForm } from "@/components/accountComponent/notificationPreferencesForm";
import { PasswordForm } from "@/components/accountComponent/passwordForm";
import { ProfileDetailsForm } from "@/components/accountComponent/profileDetailsForm";
import { ProfileSummary } from "@/components/accountComponent/profileSummary";
import { FormSection } from "@/components/organizerComponent/onboarding/formSection";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Profile" description="Your admin account. Every action you take is logged." />
      <ProfileSummary
        name={ADMIN_USER.full_name}
        email={ADMIN_USER.email}
        roles={[ADMIN_USER.role]}
        memberSince={ADMIN_USER.created_at}
        aside={
          <ButtonLink href="/admin/notifications" variant="outline" className="h-11 rounded-full px-5">
            Notifications
          </ButtonLink>
        }
      />

      <FormSection id="details-heading" title="Personal details" description="Shown to other admins in the audit log.">
        <ProfileDetailsForm initial={{ full_name: ADMIN_USER.full_name, phone: ADMIN_USER.phone }} email={ADMIN_USER.email} />
      </FormSection>

      <FormSection id="password-heading" title="Password" description="Admin accounts can approve events and payouts. Use a long, unique password.">
        <PasswordForm />
      </FormSection>

      <FormSection id="channels-heading" title="Notifications" description="Where we tell you about new reviews, applications and payouts.">
        <NotificationPreferencesForm initial={{ notify_push: true, notify_email: true, notify_sms: true }} />
      </FormSection>
    </div>
  );
}
