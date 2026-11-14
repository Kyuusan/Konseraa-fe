import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";

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
      <Button variant="outline" hoverScale={1} onClick={onBack} disabled={activeStep === 0} className="h-11 rounded-full px-5">
        <ChevronLeft aria-hidden="true" />
        Back
      </Button>
      <p className="text-sm text-text-muted">
        Step {activeStep + 1} of {totalSteps}
      </p>
      <Button hoverScale={1.02} onClick={onNext} disabled={!canContinue} className="h-11 rounded-full px-5 font-semibold">
        {isLast ? "Finish" : "Continue"}
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  );
}
