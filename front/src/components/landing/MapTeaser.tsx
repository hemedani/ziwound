"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapTeaserProps {
  locale: string;
  overline?: string;
  title?: string;
  description?: string;
  activeZonesLabel?: string;
  verifiedReportsLabel?: string;
  ctaText?: string;
  className?: string;
}

// Sample report hotspot coordinates (normalized 0-100)
const hotspots = [
  { x: 52, y: 35, label: "Middle East" },
  { x: 48, y: 28, label: "Eastern Europe" },
  { x: 68, y: 42, label: "Central Asia" },
  { x: 28, y: 38, label: "North Africa" },
  { x: 78, y: 55, label: "Southeast Asia" },
  { x: 22, y: 62, label: "Sub-Saharan Africa" },
  { x: 55, y: 65, label: "Horn of Africa" },
  { x: 45, y: 22, label: "Balkans" },
];

export function MapTeaser({
  locale,
  overline = "Global Coverage",
  title = "Crimes Documented Across the World",
  description = "Our archive spans conflict zones and regions affected by human rights violations on nearly every continent. Explore the interactive map to see documented incidents by location, severity, and date.",
  activeZonesLabel = "Active conflict zones",
  verifiedReportsLabel = "Verified reports",
  ctaText = "Explore Interactive Map",
  className,
}: MapTeaserProps) {
  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_70%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />

      <div className="container relative px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-crimson" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
                {overline}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-6 leading-tight">
              {title}
            </h2>

            <p className="text-lg text-slate-body leading-relaxed mb-8">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-crimson" />
                </span>
                <span className="text-sm text-slate-body">{activeZonesLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gold" />
                <span className="text-sm text-slate-body">{verifiedReportsLabel}</span>
              </div>
            </div>

            <Button
              size="lg"
              asChild
              className="bg-crimson hover:bg-crimson-light text-white gap-2 px-8 py-6 text-base"
            >
              <Link href={`/${locale}/war-crimes`}>
                {ctaText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: stylized map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/3] md:aspect-[16/10] rounded-2xl glass overflow-hidden"
          >
            {/* Abstract world map using SVG dots/paths */}
            <svg
              viewBox="0 0 100 60"
              className="absolute inset-0 w-full h-full opacity-40"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Simplified continent shapes using paths */}
              <path
                d="M20,15 Q25,10 30,15 T40,18 Q45,15 50,20 T55,25 Q50,30 45,28 T35,30 Q30,28 25,25 T20,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M22,32 Q28,30 32,35 T38,40 Q35,48 30,50 T22,48 Q18,42 20,38 T22,32 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M45,12 Q52,8 58,12 T65,18 Q68,25 62,28 T55,26 Q50,22 48,18 T45,12 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M48,30 Q55,28 60,32 T65,40 Q62,48 55,50 T48,48 Q44,42 46,36 T48,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M68,20 Q75,18 80,22 T85,30 Q82,38 75,40 T68,38 Q64,32 66,26 T68,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M72,42 Q78,40 82,44 T85,52 Q82,58 76,58 T70,54 Q68,48 70,44 T72,42 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M12,18 Q18,15 22,18 T24,24 Q20,28 15,26 T10,22 Q10,18 12,18 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
              <path
                d="M8,35 Q14,32 18,36 T20,44 Q16,50 10,48 T6,42 Q6,36 8,35 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-white"
              />
            </svg>

            {/* Hotspot dots */}
            {hotspots.map((spot, i) => (
              <div
                key={spot.label}
                className="absolute"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="relative"
                >
                  <span className="absolute -inset-2 rounded-full bg-crimson/20 animate-ping" />
                  <span className="relative flex h-2.5 w-2.5 rounded-full bg-crimson shadow-[0_0_8px_rgba(153,27,27,0.6)]" />
                </motion.div>
              </div>
            ))}

            {/* Grid overlay for tech feel */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-crimson/40 rounded-tl-lg" />
            <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-crimson/40 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-crimson/40 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-crimson/40 rounded-br-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
