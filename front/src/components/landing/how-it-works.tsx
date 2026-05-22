"use client";

import { motion } from "framer-motion";
import { Upload, Search, Scale, Bell, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Upload, Search, Scale, Bell,
};

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  overline?: string;
  title: string;
  subtitle: string;
  steps: Step[];
  className?: string;
}

export function HowItWorks({
  overline = "How It Works",
  title,
  subtitle,
  steps,
  className,
}: HowItWorksProps) {
  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/[0.015] to-transparent" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto w-full max-w-7xl relative px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-10 bg-crimson" />
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
              {overline}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-body leading-relaxed">{subtitle}</p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-16 start-[25%] end-[25%] h-px bg-gradient-to-r from-crimson/30 via-gold/30 to-crimson/30 hidden lg:block" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = iconMap[step.icon] || Upload;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/20">
                      <Icon className="h-7 w-7 text-crimson-light" />
                    </div>
                    <div className="absolute -top-2 -end-2 flex h-6 w-6 items-center justify-center rounded-full bg-crimson text-[11px] font-bold text-white">
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-offwhite">{step.title}</h3>
                  <p className="text-sm text-slate-body leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
