"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createNeonMiniMarkerIcon } from "@/components/map/neon-marker";

interface LocationPoint {
  lat: number;
  lng: number;
  label?: string;
  count?: number;
}

interface ContributorMapProps {
  locations: LocationPoint[];
  height?: string;
  className?: string;
}

export function ContributorMap({ locations, height, className }: ContributorMapProps) {
  if (locations.length === 0) return null;

  // Calculate center from all locations
  const centerLat = locations.reduce((sum, l) => sum + l.lat, 0) / locations.length;
  const centerLng = locations.reduce((sum, l) => sum + l.lng, 0) / locations.length;

  const resolvedHeight = height || "h-[300px]";

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-white/[0.04] ${resolvedHeight} ${className ?? ""}`}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={locations.length > 1 ? 4 : 8}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        className="h-full w-full z-0"
        style={{ background: "#0a0a0a" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        {locations.map((loc, i) => (
          <Marker
            key={i}
            position={[loc.lat, loc.lng]}
            icon={createNeonMiniMarkerIcon()}
          >
            {loc.label && (
              <Popup
                className="neon-popup"
              >
                <div className="text-sm">
                  <p className="font-semibold text-offwhite">{loc.label}</p>
                  {loc.count && (
                    <p className="text-xs text-slate-body/60">{loc.count} reports</p>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .neon-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 15, 15, 0.95) !important;
          color: #f1f5f9 !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 12px !important;
          backdrop-filter: blur(16px) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 15, 15, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
}
