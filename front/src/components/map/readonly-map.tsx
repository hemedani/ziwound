"use client";

import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: `<div style="color: #ef4444; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5)); transform: translate(-50%, -100%);">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" fill="white" />
    </svg>
  </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

interface ReadonlyMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

export function ReadonlyMap({
  latitude,
  longitude,
  zoom = 15,
  className = "h-48 w-full rounded-lg overflow-hidden border-2 shadow-sm relative z-0"
}: ReadonlyMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={customIcon} />
      </MapContainer>
    </div>
  );
}
