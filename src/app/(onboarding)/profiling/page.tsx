import Link from "next/link";
import { ProfilingStepper } from "@/components/userComponent/stepperProfiling";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-base px-4 py-10 text-text-primary sm:px-6 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-block rounded-sm font-logo text-lg uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-accent-pink"
        >
          Konsera
        </Link>
        <div className="mt-10 mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Almost there
          </p>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Set up your profile
          </h1>
        </div>
        <ProfilingStepper />
      </div>
    </main>
  );
}
