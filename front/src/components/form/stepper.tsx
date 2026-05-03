"use client";

import { useTranslations } from "next-intl";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
  labels?: string[];
}

export function Stepper({
  currentStep,
  totalSteps,
  onStepClick,
  completedSteps = [],
  labels,
}: StepperProps) {
  const t = useTranslations();

  const defaultLabels = [
    t("report.step1Title"),
    t("report.step2Title"),
    t("report.step3Title"),
    t("report.step4Title"),
    t("report.step5Title"),
  ];

  const stepLabels = labels || defaultLabels;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isClickable = onStepClick && (isCompleted || step < currentStep);

          return (
            <div key={step} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step)}
                disabled={!isClickable}
                suppressHydrationWarning
                className={cn(
                  "flex flex-col items-center gap-2 transition-colors",
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                )}
                aria-label={stepLabels[i]}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "border-muted-foreground text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {stepLabels[i]}
                </span>
              </button>
              {step < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}