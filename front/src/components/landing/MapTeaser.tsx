"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Hotspot {
  lat: number;
  lng: number;
  count: number;
}

interface MapTeaserProps {
  locale: string;
  overline?: string;
  title?: string;
  description?: string;
  activeZonesLabel?: string;
  verifiedReportsLabel?: string;
  ctaText?: string;
  className?: string;
  hotspots?: Hotspot[];
}

// Default sample report hotspot coordinates (normalized 0-100) for when no real data
const defaultHotspots = [
  { x: 52, y: 32, label: "Middle East" },
  { x: 54, y: 24, label: "Eastern Europe" },
  { x: 72, y: 30, label: "Central Asia" },
  { x: 26, y: 36, label: "North Africa" },
  { x: 80, y: 48, label: "Southeast Asia" },
  { x: 24, y: 54, label: "Sub-Saharan Africa" },
  { x: 58, y: 50, label: "Horn of Africa" },
  { x: 48, y: 20, label: "Balkans" },
];

/**
 * Convert latitude/longitude to SVG viewBox coordinates.
 * ViewBox is 0-200 width, 0-100 height.
 * Simple equirectangular projection with proper aspect ratio.
 */
function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 200;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

/**
 * Simplified world map continent paths.
 * These are stylized but recognizable continent outlines.
 */
const CONTINENT_PATHS = [
  // North America (Alaska → Canadian Arctic → Greenland → Florida → Panama → Mexico → California → Alaska)
  "M 6.7,11.1 L 33.3,8.9 L 47.2,4.4 L 69.4,4.4 L 86.1,5.6 L 76.1,15.6 L 69.4,21.1 L 55.6,35.0 L 51.1,38.9 L 56.7,45.6 L 41.7,38.9 L 33.3,30.6 L 30.6,22.2 L 16.7,16.7 Z",
  // South America (Panama → Venezuela → Brazil → Argentina → Chile → Peru → Ecuador → Colombia)
  "M 57.2,45.6 L 65.6,44.4 L 73.3,51.1 L 78.3,58.3 L 76.1,62.8 L 69.4,69.4 L 62.2,78.9 L 60.0,78.9 L 60.0,69.4 L 56.7,51.1 L 60.0,46.7 Z",
  // Europe (Portugal → France → Denmark → Norway → Finland → Baltic → Poland → Romania → Greece → Italy → Germany → Netherlands)
  "M 95.0,28.9 L 95.6,26.1 L 97.8,23.3 L 97.2,19.4 L 102.8,15.0 L 113.9,11.1 L 116.7,13.9 L 116.7,16.7 L 111.1,21.1 L 114.4,24.4 L 113.3,28.9 L 108.9,27.8 L 106.7,26.7 L 104.4,23.9 L 102.8,21.1 Z",
  // Africa (Morocco → Libya → Egypt → Horn of Africa → Kenya → Mozambique → South Africa → Namibia → Angola → Nigeria → Senegal)
  "M 96.7,30.6 L 106.7,34.4 L 118.3,35.0 L 121.1,40.0 L 125.0,48.9 L 123.3,52.8 L 122.2,55.6 L 118.3,64.4 L 113.9,68.9 L 107.8,62.2 L 107.2,54.4 L 103.9,46.7 L 91.1,41.7 L 97.2,36.1 Z",
  // Asia (Turkey → Caucasus → Siberia → Russian Far East → East China → Southeast Asia → India → Iran → Levant)
  "M 114.4,28.9 L 122.2,26.7 L 127.8,22.2 L 138.9,19.4 L 155.6,16.7 L 169.4,19.4 L 175.0,22.2 L 173.3,26.1 L 172.2,30.6 L 163.3,37.8 L 160.0,41.7 L 155.6,45.6 L 148.9,37.8 L 143.3,36.1 L 127.8,33.3 L 119.4,30.6 Z",
  // Southeast Asia / Maritime (Sumatra → Java → Bali → Moluccas → Borneo → Philippines → Luzon)
  "M 153.3,46.7 L 157.8,50.0 L 158.9,51.7 L 158.9,53.3 L 163.9,54.4 L 166.7,54.4 L 169.4,52.2 L 166.7,50.0 L 169.4,46.7 L 168.9,44.4 L 167.8,43.3 Z",
  // Australia (Darwin → Cape York → Brisbane → Sydney → Melbourne → Adelaide → Perth → NW Australia)
  "M 172.2,56.7 L 178.9,56.7 L 183.3,62.8 L 183.9,68.9 L 181.7,71.1 L 176.7,69.4 L 163.9,67.8 L 163.3,62.2 L 166.7,61.1 Z",
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
  hotspots,
}: MapTeaserProps) {
  // Build display hotspots from real data or fallback to defaults
  const displayHotspots =
    hotspots && hotspots.length > 0
      ? hotspots.map((h) => {
          const { x, y } = latLngToSvg(h.lat, h.lng);
          return { x, y, label: `${h.count}`, count: h.count };
        })
      : defaultHotspots.map((h) => ({ ...h, count: 0 }));

  const hasRealData = hotspots && hotspots.length > 0;

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

          {/* Right: stylized world map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[2/1] md:aspect-[16/9] rounded-2xl glass overflow-hidden"
          >
            {/* World map SVG */}
            <svg
              viewBox="0 0 200 100"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Subtle grid lines for longitude/latitude */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="200" height="100" fill="url(#grid)" />

              {/* Continent landmasses */}
              {CONTINENT_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="0.5"
                  className="transition-colors duration-500 hover:fill-white/[0.1]"
                />
              ))}

              {/* Equator line */}
              <line
                x1="0"
                y1="50"
                x2="200"
                y2="50"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.3"
                strokeDasharray="2,4"
              />

              {/* Prime meridian */}
              <line
                x1="100"
                y1="0"
                x2="100"
                y2="100"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.3"
                strokeDasharray="2,4"
              />
            </svg>

            {/* Hotspot dots — positioned absolutely over the SVG */}
            {displayHotspots.map((spot, i) => (
              <div
                key={hasRealData ? `${spot.x}-${spot.y}-${i}` : spot.label}
                className="absolute"
                style={{
                  left: `${(spot.x / 200) * 100}%`,
                  top: `${(spot.y / 100) * 100}%`,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="relative group"
                >
                  {/* Pulsing ring */}
                  <span className="absolute -inset-3 rounded-full bg-crimson/15 animate-ping" />
                  <span className="absolute -inset-1.5 rounded-full bg-crimson/10 animate-pulse" />
                  {/* Core dot */}
                  <span className="relative flex h-3 w-3 rounded-full bg-crimson shadow-[0_0_12px_rgba(153,27,27,0.7)]" />
                  {/* Tooltip for real data */}
                  {hasRealData && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-black/80 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                      {spot.count} reports
                    </div>
                  )}
                </motion.div>
              </div>
            ))}

            {/* Corner frame accents */}
            <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-crimson/40 rounded-tl-lg" />
            <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-crimson/40 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-crimson/40 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-crimson/40 rounded-br-lg" />

            {/* Bottom label bar */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] text-slate-body/60">
              <MapPin className="h-3 w-3" />
              <span>Interactive preview</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
