"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)", scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/[0.015] to-transparent" />

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-crimson/10 blur-[120px]"
          animate={{ x: [0, 60, -30, 40, 0], y: [0, -40, 50, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-64 -right-48 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-crimson/[0.07] to-gold/[0.05] blur-[140px]"
          animate={{ x: [0, -50, 40, -30, 0], y: [0, 50, -30, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 h-[350px] w-[350px] rounded-full bg-gold/[0.04] blur-[100px]"
          animate={{ x: [0, 40, -50, 30, 0], y: [0, -30, 40, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Edge gradient vignettes */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" aria-hidden="true" />

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

        <motion.div
          ref={containerRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {cards.map((card) => {
            const Icon = iconMap[card.icon] || Shield;
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
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
        </motion.div>
      </div>
    </section>
  );
}
