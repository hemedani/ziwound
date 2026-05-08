"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

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

const defaultHotspots: Hotspot[] = [
  { lat: 33.5, lng: 44.4, count: 0 },   // Iraq / Middle East
  { lat: 50.4, lng: 30.5, count: 0 },   // Ukraine / Eastern Europe
  { lat: 34.5, lng: 69.2, count: 0 },   // Afghanistan / Central Asia
  { lat: 32.9, lng: 13.2, count: 0 },   // Libya / North Africa
  { lat: 12.0, lng: 105.0, count: 0 },  // Cambodia / Southeast Asia
  { lat: 6.5, lng: 20.0, count: 0 },    // Central African Republic
  { lat: 9.1, lng: 40.5, count: 0 },    // Ethiopia / Horn of Africa
  { lat: 43.9, lng: 18.4, count: 0 },   // Bosnia / Balkans
  { lat: 15.4, lng: 44.2, count: 0 },   // Yemen
  { lat: 1.4, lng: 32.3, count: 0 },    // Uganda
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
  const displayHotspots =
    hotspots && hotspots.length > 0 ? hotspots : defaultHotspots;

  const hasRealData = hotspots && hotspots.length > 0;

  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_70%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />

      <div className="mx-auto w-full max-w-7xl relative px-4 md:px-8">
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

          {/* Right: Leaflet world map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[2/1] md:aspect-[16/9] rounded-2xl glass overflow-hidden border border-white/[0.06]"
          >
            <MapContainer
              center={[20, 0]}
              zoom={2}
              minZoom={2}
              maxZoom={2}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              touchZoom={false}
              boxZoom={false}
              style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />

              {displayHotspots.map((spot, i) => (
                <CircleMarker
                  key={`${spot.lat}-${spot.lng}-${i}`}
                  center={[spot.lat, spot.lng]}
                  radius={hasRealData ? Math.min(10, 4 + spot.count / 3) : 5}
                  pathOptions={{
                    fillColor: "#991b1b",
                    color: "#b91c1c",
                    weight: 1,
                    fillOpacity: 0.85,
                  }}
                >
                  {hasRealData && (
                    <Tooltip
                      direction="top"
                      offset={[0, -8]}
                      className="!bg-black/80 !border-white/10 !text-white !text-[10px] !px-2 !py-1 !rounded-md"
                    >
                      {spot.count} reports
                    </Tooltip>
                  )}
                </CircleMarker>
              ))}
            </MapContainer>

            {/* Pulse overlay dots (CSS animated) */}
            <div className="absolute inset-0 pointer-events-none">
              {displayHotspots.slice(0, 6).map((spot, i) => {
                const x = ((spot.lng + 180) / 360) * 100;
                const y = ((90 - spot.lat) / 180) * 100;
                return (
                  <div
                    key={`pulse-${i}`}
                    className="absolute"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="absolute -inset-3 rounded-full bg-crimson/20 animate-ping" />
                  </div>
                );
              })}
            </div>

            {/* Corner frame accents */}
            <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-crimson/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-crimson/40 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 h-8 w-8 border-l-2 border-b-2 border-crimson/40 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-crimson/40 rounded-br-lg pointer-events-none" />

            {/* Bottom label bar */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] text-slate-body/60 pointer-events-none">
              <MapPin className="h-3 w-3" />
              <span>Interactive preview</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
