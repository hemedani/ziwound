"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepWrapperProps {
  step: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function StepWrapper({
  step,
  title,
  description,
  icon,
  children,
  className,
}: StepWrapperProps) {
  const t = useTranslations("common");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn("rounded-2xl glass-strong overflow-hidden", className)}
    >
      <div className="relative border-b border-white/[0.06] bg-gradient-to-r from-crimson/[0.03] to-transparent px-6 pb-4 pt-5 md:px-8">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/20">
              <span className="text-crimson">{icon}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-crimson/60">
                {t("step")} {String(step).padStart(2, "0")}
              </span>
            </div>
            <h2 className="mt-1 text-lg font-semibold text-offwhite">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-slate-body/70">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-8">{children}</div>
    </motion.div>
  );
}
