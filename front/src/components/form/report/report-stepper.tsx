"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, FileText, CalendarClock, MapPin, FileImage, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportStepperProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

const STEP_ICONS = [FileText, CalendarClock, MapPin, FileImage, ClipboardCheck];

export function ReportStepper({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
}: ReportStepperProps) {
  const t = useTranslations("report");

  // Calculate progress for the connecting track
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative">
      {/* Connecting track — sits behind the circles */}
      <div className="absolute top-[22px] left-[40px] right-[40px] h-[3px] rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-crimson"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between relative">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isPast = step < currentStep;
          const isClickable = !!(onStepClick && (isCompleted || isPast));
          const Icon = STEP_ICONS[i];
          const label = t(`step${step}Title`);

          return (
            <div key={step} className="flex flex-col items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step)}
                suppressHydrationWarning
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isCompleted && "border-crimson bg-crimson",
                  isCurrent && "border-crimson bg-crimson/20",
                  !isCompleted && !isCurrent && "border-white/10 bg-white/5",
                  isClickable && "cursor-pointer hover:opacity-80",
                  !isClickable && "cursor-default",
                )}
                aria-label={label}
                tabIndex={isClickable ? 0 : -1}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isCurrent ? "text-crimson" : "text-slate-body/50",
                    )}
                  />
                )}

                {/* Active step glow */}
                {isCurrent && (
                  <span className="absolute -inset-2 rounded-full bg-crimson/10 animate-pulse-glow" />
                )}
              </button>

              {/* Step label — hidden on mobile */}
              <span
                className={cn(
                  "hidden sm:block text-xs font-medium text-center leading-tight max-w-[80px] transition-colors",
                  isCurrent && "text-crimson",
                  isCompleted && "text-offwhite",
                  !isCompleted && !isCurrent && "text-slate-body/50",
                )}
              >
                {label}
              </span>

              {/* Step number — visible only on mobile */}
              <span className="sm:hidden text-[10px] font-mono text-slate-body/30">
                {String(step).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
