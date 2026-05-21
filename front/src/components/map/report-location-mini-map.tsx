"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createNeonMiniMarkerIcon, createNeonMarkerIcon } from "./neon-marker";

interface ReportLocationMiniMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  variant?: "card" | "detail";
  className?: string;
  interactive?: boolean;
}

export function ReportLocationMiniMap({
  latitude,
  longitude,
  zoom,
  height,
  variant = "card",
  className,
  interactive = false,
}: ReportLocationMiniMapProps) {
  const position: [number, number] = [latitude, longitude];

  // Defaults per variant
  const defaultZoom = variant === "card" ? 12 : 14;
  const defaultHeight = variant === "card" ? "h-[160px]" : "h-[350px]";
  const icon = variant === "card" ? createNeonMiniMarkerIcon() : createNeonMarkerIcon({ size: 36, showIcon: true });

  const resolvedZoom = zoom ?? defaultZoom;
  const resolvedHeight = height ?? defaultHeight;

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-white/[0.04] ${resolvedHeight} ${className ?? ""}`}>
      <MapContainer
        center={position}
        zoom={resolvedZoom}
        scrollWheelZoom={interactive}
        zoomControl={interactive}
        attributionControl={false}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        className="h-full w-full z-0"
        style={{ background: "#0a0a0a" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <Marker position={position} icon={icon} />
      </MapContainer>

      {/* Inline styles for Leaflet overrides — dark theme consistency */}
      <style>{`
        .neon-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
