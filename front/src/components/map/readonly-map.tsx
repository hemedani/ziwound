"use client";

import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createNeonMarkerIcon } from "./neon-marker";

interface ReadonlyMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  hideControls?: boolean;
}

export function ReadonlyMap({
  latitude,
  longitude,
  zoom = 15,
  className = "h-48 w-full rounded-lg overflow-hidden border-2 shadow-sm relative z-0",
  hideControls = false,
}: ReadonlyMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        zoomControl={!hideControls}
        attributionControl={!hideControls}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={createNeonMarkerIcon({ size: 40, showIcon: true })} />
      </MapContainer>

      {/* Leaflet marker class override */}
      <style>{`
        .neon-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
