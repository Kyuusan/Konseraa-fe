"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfilingStep {
  id: string;
  title: string;
  icon: LucideIcon;
  heading: string;
  description: string;
}

interface StepIndicatorProps {
  steps: ProfilingStep[];
  activeStep: number;
  onStepClick: (index: number) => void;
}

export function StepIndicator({ steps, activeStep, onStepClick }: StepIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();
  // The track runs from the centre of the first step to the centre of the last.
  const inset = 50 / steps.length;
  const progress = steps.length > 1 ? activeStep / (steps.length - 1) : 0;

  return (
    <div className="relative">
      <div
        className="absolute top-5 h-0.5 bg-text-primary/12"
        style={{ left: `${inset}%`, right: `${inset}%` }}
      />
      <motion.div
        className="absolute top-5 h-0.5 origin-left bg-accent-lime"
        style={{ left: `${inset}%`, right: `${inset}%` }}
        initial={false}
        animate={{ scaleX: progress }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      <motion.span
        className="absolute size-2 rounded-full bg-accent-lime"
        style={{ top: 21, x: "-50%", y: "-50%" }}
        initial={false}
        animate={{ left: `${inset + progress * (100 - inset * 2)}%` }}
        transition={{ type: "spring", stiffness: 160, damping: 24 }}
      />

      <ol className="relative flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const Icon = step.icon;

          return (
            <li key={step.id} className="flex flex-1 flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => onStepClick(index)}
                disabled={!isCompleted}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.title} step${isCompleted ? ", completed" : ""}`}
                className="group relative z-10 flex size-10 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base enabled:cursor-pointer"
              >
                <span
                  className={cn(
                    "absolute inset-0 rounded-full transition-colors duration-300",
                    isCompleted || isActive ? "bg-accent-lime" : "bg-bg-surface-2",
                  )}
                />
                {isActive && !prefersReducedMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-full ring-2 ring-accent-lime/50"
                    animate={{ scale: [1, 1.45, 1], opacity: [1, 0.2, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.span
                  className="relative flex items-center justify-center"
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isCompleted ? "check" : "icon"}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="flex items-center justify-center"
                    >
                      {isCompleted ? (
                        <Check className="size-5 text-bg-base" strokeWidth={3} aria-hidden="true" />
                      ) : (
                        <Icon
                          className={cn("size-5", isActive ? "text-bg-base" : "text-text-muted")}
                          aria-hidden="true"
                        />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </button>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                  isActive || isCompleted ? "text-text-primary" : "text-text-muted",
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
