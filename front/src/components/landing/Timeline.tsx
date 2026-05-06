"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  href: string;
}

interface TimelineProps {
  overline?: string;
  title?: string;
  subtitle?: string;
  viewDetails?: string;
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({
  overline = "Timeline",
  title = "Recent Documented Events",
  subtitle = "A chronological record of recently verified incidents and investigations from our global network.",
  viewDetails = "View Details",
  events,
  className,
}: TimelineProps) {
  if (!events.length) return null;

  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/[0.015] to-transparent" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container relative px-4 md:px-8">
        {/* Header */}
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute start-4 md:start-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-crimson/50 via-gold/30 to-transparent md:-translate-x-px" />

          <div className="space-y-12">
            {events.map((event, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div
                    className={cn(
                      "flex flex-col md:flex-row items-start gap-6 md:gap-0",
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Content card */}
                    <div className="flex-1 md:px-12">
                      <Link
                        href={event.href}
                        className="group block rounded-2xl glass-light p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-body">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gold" />
                            {event.date}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {event.location}
                            </span>
                          )}
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-offwhite transition-colors group-hover:text-gold">
                          {event.title}
                        </h3>
                        <p className="text-sm text-slate-body leading-relaxed mb-4">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-1 text-sm font-medium text-crimson transition-colors group-hover:text-gold">
                          <span>{viewDetails}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    </div>

                    {/* Center dot */}
                    <div className="absolute start-4 md:start-1/2 top-6 md:top-8 -translate-x-1/2">
                      <div className="h-4 w-4 rounded-full bg-crimson border-4 border-background shadow-lg shadow-crimson/30" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
