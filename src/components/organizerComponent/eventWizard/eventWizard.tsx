"use client";

import { CalendarClock, ClipboardCheck, FileText, MapPin, Ticket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { z } from "zod";
import { StepIndicator, type ProfilingStep } from "@/components/userComponent/stepperProfiling/stepIndicator/StepIndicator";
import { StepNavigation } from "@/components/userComponent/stepperProfiling/stepNavigation/StepNavigation";
import {
  EventBasicsFormSchema,
  EventSectionsFormSchema,
  EventSessionsFormSchema,
  EventTiersFormSchema,
  EventVenueFormSchema,
} from "@/types/eventForm";
import { BasicsStep } from "./steps/basicsStep";
import { ReviewStep } from "./steps/reviewStep";
import { SessionsStep } from "./steps/sessionsStep";
import { TicketsStep } from "./steps/ticketsStep";
import { VenueStep } from "./steps/venueStep";
import { SubmittedNotice } from "./submittedNotice";
import { TIMEZONES, type EventWizardValues } from "./wizardValues";

const STEPS: ProfilingStep[] = [
  { id: "basics", title: "Basics", icon: FileText, heading: "Tell fans about the show", description: "Title, description and artwork." },
  { id: "venue", title: "Venue", icon: MapPin, heading: "Where is it?", description: "The venue and the permit for this event." },
  { id: "sessions", title: "Sessions", icon: CalendarClock, heading: "When is it?", description: "Add a session for every show date." },
  { id: "tickets", title: "Tickets", icon: Ticket, heading: "Set up tickets", description: "Tiers, prices and how many you sell." },
  { id: "review", title: "Review", icon: ClipboardCheck, heading: "Check and submit", description: "Make sure everything is right before review." },
];

const toErrors = (error: z.ZodError) =>
  Object.fromEntries(error.issues.toReversed().map((issue) => [issue.path.join("."), issue.message]));

interface EventWizardProps {
  initial: EventWizardValues;
  categories: string[];
}

export function EventWizard({ initial, categories }: EventWizardProps) {
  const [values, setValues] = useState(initial);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const step = STEPS[activeStep];
  const set = <K extends keyof EventWizardValues>(key: K) => (value: EventWizardValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  function goTo(index: number) {
    setErrors({});
    setActiveStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Validates only the step on screen; the review step has nothing new to check.
  function validateStep() {
    // The venue step also holds the areas (venue_sections); their errors are keyed "sections.<i>.<field>".
    if (step.id === "venue") {
      const venue = EventVenueFormSchema.safeParse(values.venue);
      const sections = EventSectionsFormSchema.safeParse(values.sections);
      const next = {
        ...(venue.success ? {} : toErrors(venue.error)),
        ...(sections.success ? {} : Object.fromEntries(Object.entries(toErrors(sections.error)).map(([key, message]) => [`sections.${key}`, message]))),
      };
      if (Object.keys(next).length > 0) setErrors(next);
      return Object.keys(next).length === 0;
    }
    const result =
      step.id === "basics"
        ? EventBasicsFormSchema.safeParse(values.basics)
        : step.id === "venue"
          ? EventVenueFormSchema.safeParse(values.venue)
          : step.id === "sessions"
            ? EventSessionsFormSchema.safeParse(values.sessions)
            : step.id === "tickets"
              ? EventTiersFormSchema.safeParse(values.tiers)
              : { success: true as const };
    if (!result.success) setErrors(toErrors(result.error));
    return result.success;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (activeStep < STEPS.length - 1) return goTo(activeStep + 1);
    // Stands in for POST /events + submit for review: nothing is stored.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) return <SubmittedNotice title={values.basics.title} />;

  const timezoneLabel = TIMEZONES.find((zone) => zone.value === values.venue.timezone)?.label ?? values.venue.timezone;

  return (
    <div className="flex flex-col gap-10">
      <StepIndicator steps={STEPS} activeStep={activeStep} onStepClick={(index) => index < activeStep && goTo(index)} />

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
            <p className="text-text-primary/70">{step.description}</p>
          </div>

          {step.id === "basics" && (
            <BasicsStep value={values.basics} errors={errors} categories={categories} onChange={set("basics")} />
          )}
          {step.id === "venue" && (
            <VenueStep
              value={values.venue}
              sections={values.sections}
              errors={errors}
              onChange={set("venue")}
              onSectionsChange={set("sections")}
            />
          )}
          {step.id === "sessions" && (
            <SessionsStep value={values.sessions} errors={errors} timezoneLabel={timezoneLabel} onChange={set("sessions")} />
          )}
          {step.id === "tickets" && (
            <TicketsStep
              value={values.tiers}
              errors={errors}
              capacity={Number(values.venue.capacity) || 0}
              onChange={set("tiers")}
              sections={values.sections}
            />
          )}
          {step.id === "review" && <ReviewStep values={values} onEdit={goTo} />}
        </motion.section>
      </AnimatePresence>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="text-sm text-danger">
          Some fields need attention before you continue.
        </p>
      )}

      <StepNavigation
        activeStep={activeStep}
        totalSteps={STEPS.length}
        canContinue
        onBack={() => goTo(activeStep - 1)}
        onNext={handleNext}
        finishLabel="Submit for review"
      />
    </div>
  );
}
