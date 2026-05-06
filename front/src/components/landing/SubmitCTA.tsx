"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitCTAProps {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  note: string;
  className?: string;
}

export function SubmitCTA({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  note,
  className,
}: SubmitCTAProps) {
  return (
    <section className={cn("relative py-24 md:py-32 overflow-hidden", className)}>
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-crimson-dark/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.12)_0%,_transparent_70%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />

      <div className="container relative px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/20">
            <FilePlus className="h-8 w-8 text-crimson" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-6 leading-tight">
            {title}
          </h2>

          <p className="text-lg md:text-xl text-slate-body mb-10 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-crimson hover:bg-crimson-light text-white gap-2 px-10 py-6 text-base animate-pulse-glow"
            >
              <Link href="/reports/new">
                {primaryCta}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/15 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white gap-2 px-10 py-6 text-base backdrop-blur-sm"
            >
              <Link href="/war-crimes">{secondaryCta}</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-slate-body/70">{note}</p>
        </motion.div>
      </div>
    </section>
  );
}
