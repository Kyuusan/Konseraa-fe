import { EVENTS, FAVORITE_GENRES } from "@/__fixtures__/events";
import { getCurrentOrganizer, getCurrentSession } from "@/__fixtures__/session";
import { FavoriteGenresForm } from "@/components/accountComponent/favoriteGenresForm";
import { NotificationPreferencesForm } from "@/components/accountComponent/notificationPreferencesForm";
import { PasswordForm } from "@/components/accountComponent/passwordForm";
import { ProfileDetailsForm } from "@/components/accountComponent/profileDetailsForm";
import { ProfileSummary } from "@/components/accountComponent/profileSummary";
import { FormSection } from "@/components/organizerComponent/onboarding/formSection";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";
import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { StatusBadge } from "@/components/userComponent/shared/statusBadge";

// One account for fans and organizers (agreed): the organizer part shows once they applied.
export default async function Page() {
  const session = await getCurrentSession();
  const organizerData = await getCurrentOrganizer();
  const { user } = session;
  const roles = session.roles.includes("organizer") ? ["Fan", "Organizer"] : ["Fan"];
  const genres = [...new Set(EVENTS.flatMap((event) => event.categories))].toSorted();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Profile" description="Your details, music taste, password and how we reach you." />
      <ProfileSummary
        name={user.full_name}
        email={user.email}
        roles={roles}
        memberSince={user.created_at}
        aside={
          <ButtonLink href="/notifications" variant="outline" className="h-11 rounded-full px-5">
            Notifications
          </ButtonLink>
        }
      />

      <FormSection id="details-heading" title="Personal details" description="Shown on your tickets and used by organizers at the gate.">
        <ProfileDetailsForm initial={{ full_name: user.full_name, phone: user.phone }} email={user.email} />
      </FormSection>

      <FormSection
        id="taste-heading"
        title="Music taste"
        description="Your favourite genres, first picked during sign-up. They decide what Home recommends."
      >
        <FavoriteGenresForm genres={genres} initial={FAVORITE_GENRES} />
      </FormSection>

      <FormSection id="password-heading" title="Password" description="Use at least 8 characters you don't use anywhere else.">
        <PasswordForm />
      </FormSection>

      <FormSection id="channels-heading" title="Notifications" description="Where we send booking updates and event reminders.">
        <NotificationPreferencesForm initial={{ notify_push: true, notify_email: true, notify_sms: false }} />
      </FormSection>

      <FormSection
        id="organizer-heading"
        title="Organizer"
        description="Selling tickets uses this same account. Organizer details are managed from the organizer area."
      >
        {organizerData ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-bg-surface-2 p-5">
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold">{organizerData.organizer.company_name}</p>
              <p className="text-sm text-text-primary/70">
                {organizerData.organizer.legal_entity_type === "company" ? "Company" : "Individual"}
              </p>
              <StatusBadge status={organizerData.organizer.verification_status} />
            </div>
            <ButtonLink href="/organizer" variant="outline" className="h-11 rounded-full px-5">
              Open organizer area
            </ButtonLink>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-bg-surface-2 p-5">
            <p className="text-sm text-text-primary/80">You are not an organizer yet.</p>
            <ButtonLink href="/organizer" variant="outline" className="h-11 rounded-full px-5">
              Become an organizer
            </ButtonLink>
          </div>
        )}
      </FormSection>
    </div>
  );
}
