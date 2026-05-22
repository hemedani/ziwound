"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Scale, HeartHandshake, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Shield, Eye, Scale, HeartHandshake,
};

interface MatterCard {
  icon: string;
  title: string;
  description: string;
}

interface WhyMattersProps {
  overline?: string;
  title: string;
  subtitle: string;
  cards: MatterCard[];
  className?: string;
}

export function WhyMatters({
  overline = "Why ZiWound Matters",
  title,
  subtitle,
  cards,
  className,
}: WhyMattersProps) {
  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/[0.015] to-transparent" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon] || Shield;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl glass-light p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_0_40px_-12px_rgba(153,27,27,0.2)] border border-white/[0.06]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 ring-1 ring-crimson/20 transition-all duration-300 group-hover:bg-crimson/20 group-hover:ring-crimson/30">
                  <Icon className="h-6 w-6 text-crimson-light" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-offwhite">{card.title}</h3>
                <p className="text-sm text-slate-body leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
