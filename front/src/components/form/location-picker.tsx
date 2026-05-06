"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
}

interface LocationPickerProps {
  label: string;
  description?: string;
  value?: Location;
  onChange: (location: Location) => void;
  error?: string;
  showMap?: boolean;
}

export function LocationPicker({
  label,
  description,
  value = { address: "" },
  onChange,
  error,
  showMap = false, // We will render it regardless of this prop now to show the map
}: LocationPickerProps) {
  const t = useTranslations("common");
  const [address, setAddress] = useState(value.address);
  const [isSearching, setIsSearching] = useState(false);

  // Default to Tehran, Iran if no location is provided
  const defaultPosition: [number, number] = [35.6892, 51.389];
  const position: [number, number] =
    value.latitude && value.longitude ? [value.latitude, value.longitude] : defaultPosition;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    onChange({ ...value, address: newAddress });
  };

  const handleMapClick = (lat: number, lng: number) => {
    onChange({ ...value, latitude: lat, longitude: lng });
  };

  const handleUseCurrentLocation = () => {
    setIsSearching(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          onChange({
            address: address || t("locationPicker.currentLocation") || "Current Location",
            latitude,
            longitude,
          });
          setIsSearching(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setIsSearching(false);
        },
      );
    } else {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      <div className="space-y-2">
        {/* Address input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("locationPicker.placeholder")}
              value={address}
              onChange={handleAddressChange}
              className="ps-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUseCurrentLocation}
            disabled={isSearching}
            title={t("locationPicker.useCurrent")}
            aria-label={t("locationPicker.useCurrent")}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Map Implementation */}
        <div className="mt-4 h-[350px] w-full rounded-xl overflow-hidden border-2 shadow-sm relative z-0">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {value.latitude && value.longitude && <Marker position={position} icon={customIcon} />}
            <MapClickHandler onSelect={handleMapClick} />
            <MapUpdater center={position} />
          </MapContainer>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
