import { PageHeader } from "@/components/userComponent/shared/pageHeader";
import { ButtonLink } from "@/components/userComponent/shared/buttonLink";

// The steps are a real sequence, so they are numbered (design.md §6).
const STEPS = [
  { title: "Register and get verified", body: "Tell us who you are and who is responsible. Our team checks the data before anything goes live." },
  { title: "Create your event", body: "Add sessions, ticket tiers and the venue permit, then submit it for review." },
  { title: "Sell and check in", body: "Once approved the event goes live. Your gatekeepers scan tickets at the door." },
  { title: "Get paid", body: "Revenue minus the platform fee is paid out three days after the event ends." },
];

const REQUIREMENTS = [
  "Organizer name, city and full address",
  "Full name, NIK, phone and email of the person in charge",
  "A photo or scan of that person's ID card (KTP)",
  "For companies: NIB or deed of establishment (optional)",
];

export function OrganizerIntro() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Organizer"
        title="Sell tickets for your shows on Konsera"
        description="Organizer tools unlock once your account has been verified."
        actions={
          <ButtonLink href="/organizer/apply" hoverScale={1.02} className="h-12 rounded-full px-6 text-base font-semibold">
            Register as organizer
          </ButtonLink>
        }
      />

      <section aria-labelledby="how-heading" className="space-y-5">
        <h2 id="how-heading" className="font-heading text-2xl font-semibold">How it works</h2>
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="space-y-2 rounded-[20px] bg-bg-surface p-5">
              <p className="font-heading text-3xl font-bold text-accent-lime">{String(index + 1).padStart(2, "0")}</p>
              <p className="font-heading text-lg font-semibold">{step.title}</p>
              <p className="text-sm text-text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="needs-heading" className="space-y-4 rounded-[20px] bg-bg-surface p-6">
        <h2 id="needs-heading" className="font-heading text-xl font-semibold">What you&apos;ll need</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-text-muted marker:text-accent-lime">
          {REQUIREMENTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-sm text-text-muted">
          Each event also needs its own permit (crowd permit or venue approval) when you submit it.
        </p>
      </section>
    </div>
  );
}
