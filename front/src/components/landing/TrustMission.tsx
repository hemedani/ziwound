"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Scale, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustMissionProps {
  overline?: string;
  title: string;
  p1: string;
  p2: string;
  tagline: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  className?: string;
}

export function TrustMission({
  overline = "Our Mission",
  title,
  p1,
  p2,
  tagline,
  pillar1Title,
  pillar1Desc,
  pillar2Title,
  pillar2Desc,
  pillar3Title,
  pillar3Desc,
  pillar4Title,
  pillar4Desc,
  className,
}: TrustMissionProps) {
  const pillars = [
    { icon: Shield, title: pillar1Title, description: pillar1Desc },
    { icon: Eye, title: pillar2Title, description: pillar2Desc },
    { icon: Scale, title: pillar3Title, description: pillar3Desc },
    { icon: HeartHandshake, title: pillar4Title, description: pillar4Desc },
  ];

  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/[0.02] to-transparent" />

      <div className="container relative px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: mission statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-crimson" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
                {overline}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-6 leading-tight">
              {title}
            </h2>

            <div className="space-y-4 text-slate-body leading-relaxed text-lg">
              <p>{p1}</p>
              <p>{p2}</p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-1 w-16 bg-crimson rounded-full" />
              <span className="text-sm text-slate-body italic">{tagline}</span>
            </div>
          </motion.div>

          {/* Right: pillars grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl glass-light p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10">
                  <pillar.icon className="h-6 w-6 text-crimson" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-offwhite">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-body leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
