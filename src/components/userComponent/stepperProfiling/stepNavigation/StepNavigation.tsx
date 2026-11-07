import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/buttonAnimate";

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function StepNavigation({
  activeStep,
  totalSteps,
  canContinue,
  onBack,
  onNext,
}: StepNavigationProps) {
  const isLast = activeStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" onClick={onBack} disabled={activeStep === 0}>
        <ChevronLeft className="size-4" aria-hidden="true" />
        Back
      </Button>
      <p className="text-sm text-text-muted">
        Step {activeStep + 1} of {totalSteps}
      </p>
      <Button onClick={onNext} disabled={!canContinue}>
        {isLast ? "Finish" : "Continue"}
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
