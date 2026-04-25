"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { DeepPartial, reportSchema } from "@/types/declarations";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Webpack/Turbopack
const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface WarCrimesMapProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
}

function WarCrimesMapInner({ reports, locale }: WarCrimesMapProps) {
  const t = useTranslations("warCrimes");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reportsWithLocation = reports.filter(
    (r) => r.location?.coordinates && r.location.coordinates.length >= 2
  );

  if (!mounted) return null;

  if (reportsWithLocation.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg bg-muted/20">
        <p className="text-xl text-muted-foreground mb-2">{t("noResults")}</p>
        <p className="text-sm text-muted-foreground">{t("noResultsDescription")}</p>
      </div>
    );
  }

  // Calculate center based on average of all coordinates, or default to a central location
  let centerPosition: [number, number] = [31.5, 34.8]; // Default Middle East approx
  if (reportsWithLocation.length > 0) {
    const latSum = reportsWithLocation.reduce((sum, r) => sum + (r.location?.coordinates?.[1] || 0), 0);
    const lngSum = reportsWithLocation.reduce((sum, r) => sum + (r.location?.coordinates?.[0] || 0), 0);
    centerPosition = [latSum / reportsWithLocation.length, lngSum / reportsWithLocation.length];
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden border">
      <div className="absolute top-4 start-4 z-[400] bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-sm">
        <p className="font-medium text-foreground">
          {reportsWithLocation.length} {t("withLocation")}
        </p>
      </div>

      <MapContainer
        center={centerPosition}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
        >
          {reportsWithLocation.map((report) => (
            <Marker
              key={report._id}
              position={[
                report.location?.coordinates?.[1] as number,
                report.location?.coordinates?.[0] as number,
              ]}
            >
              <Popup className="rounded-lg shadow-sm border">
                <div className="min-w-[200px] p-1">
                  <h4 className="font-bold text-sm mb-1 leading-tight">{report.title}</h4>
                  {report.category && (
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded mb-2">
                      {report.category.name}
                    </span>
                  )}
                  {report.address && (
                    <p className="text-xs text-muted-foreground truncate mb-2">{report.address}</p>
                  )}
                  <a
                    href={`/${locale}/reports/${report._id}`}
                    className="block text-center text-xs bg-primary text-primary-foreground py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export const WarCrimesMap = dynamic(() => Promise.resolve(WarCrimesMapInner), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-lg border bg-muted animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading Map...</p>
    </div>
  ),
});
