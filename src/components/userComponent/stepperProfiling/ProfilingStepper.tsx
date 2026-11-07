"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DomicileStep, type Domicile } from "./domicileStep/DomicileStep";
import { FavoritesStep } from "./favoritesStep/FavoritesStep";
import { StepIndicator, type ProfilingStep } from "./stepIndicator/StepIndicator";
import { StepNavigation } from "./stepNavigation/StepNavigation";

const STEPS: ProfilingStep[] = [
  {
    id: "domicile",
    title: "Domicile",
    icon: MapPin,
    heading: "Where are you based?",
    description: "We'll show concerts near you first.",
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: Music,
    heading: "What do you listen to?",
    description: "Pick at least one genre and one artist you love.",
  },
];

export function ProfilingStepper() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [domicile, setDomicile] = useState<Domicile>({ country: "", province: "", city: "" });
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);

  const step = STEPS[activeStep];
  const canContinue =
    step.id === "domicile"
      ? Boolean(domicile.country && domicile.province && domicile.city)
      : genres.length > 0 && artists.length > 0;

  function handleNext() {
    if (!canContinue) return;
    if (activeStep === STEPS.length - 1) {
      router.push("/home");
      return;
    }
    setActiveStep((current) => current + 1);
  }

  return (
    <div className="flex flex-col gap-10">
      <StepIndicator
        steps={STEPS}
        activeStep={activeStep}
        // Only finished steps can be revisited; later steps open through Continue.
        onStepClick={(index) => index < activeStep && setActiveStep(index)}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          aria-labelledby={`${step.id}-heading`}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h2 id={`${step.id}-heading`} className="font-heading text-2xl font-semibold sm:text-3xl">
              {step.heading}
            </h2>
            <p className="text-text-muted">{step.description}</p>
          </div>

          {step.id === "domicile" ? (
            <DomicileStep value={domicile} onChange={setDomicile} />
          ) : (
            <FavoritesStep
              genres={genres}
              onGenresChange={setGenres}
              artists={artists}
              onArtistsChange={setArtists}
            />
          )}
        </motion.section>
      </AnimatePresence>

      <div className="h-px bg-border" />

      <StepNavigation
        activeStep={activeStep}
        totalSteps={STEPS.length}
        canContinue={canContinue}
        onBack={() => setActiveStep((current) => Math.max(0, current - 1))}
        onNext={handleNext}
      />
    </div>
  );
}
