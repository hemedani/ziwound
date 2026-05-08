"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { DeepPartial, reportSchema } from "@/types/declarations";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const redDotIcon = L.divIcon({
  className: "custom-red-dot-marker",
  html: '<div class="red-dot-inner" />',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 36;
  if (count >= 10 && count < 50) size = 44;
  else if (count >= 50 && count < 100) size = 52;
  else if (count >= 100) size = 60;

  return L.divIcon({
    html: `<div class="custom-cluster-icon" style="width:${size}px;height:${size}px">${count}</div>`,
    className: "custom-cluster-marker",
    iconSize: L.point(size, size),
  });
};

interface WarCrimesMapProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
}

export default function WarCrimesMapInner({ reports, locale }: WarCrimesMapProps) {
  const t = useTranslations("warCrimes");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentBbox, setCurrentBbox] = useState<number[] | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reportsWithLocation = reports.filter(
    (r) => r.location?.coordinates && r.location.coordinates.length >= 2
  );

  const handleSearchInArea = () => {
    if (!currentBbox) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("bbox", currentBbox.join(","));
    params.set("view", "map");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAreaSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("bbox");
    params.set("view", "map");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setCurrentBbox(null);
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: (e) => {
        const bounds = e.target.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        setCurrentBbox([sw.lng, sw.lat, ne.lng, ne.lat]);
      },
    });
    return null;
  };

  if (!mounted) return null;

  if (reportsWithLocation.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg bg-muted/20">
        <p className="text-xl text-muted-foreground mb-2">{t("noResults")}</p>
        <p className="text-sm text-muted-foreground">{t("noResultsDescription")}</p>
      </div>
    );
  }

  let centerPosition: [number, number] = [31.5, 34.8];
  if (reportsWithLocation.length > 0) {
    const latSum = reportsWithLocation.reduce((sum, r) => sum + (r.location?.coordinates?.[1] || 0), 0);
    const lngSum = reportsWithLocation.reduce((sum, r) => sum + (r.location?.coordinates?.[0] || 0), 0);
    centerPosition = [latSum / reportsWithLocation.length, lngSum / reportsWithLocation.length];
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden border">
      <style>{`
        .custom-red-dot-marker {
          background: transparent !important;
          border: none !important;
        }
        .red-dot-inner {
          width: 16px;
          height: 16px;
          background: #dc2626;
          border: 2px solid #991b1b;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(220, 38, 38, 0.6);
        }
        .custom-cluster-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-cluster-icon {
          background: rgba(220, 38, 38, 0.85);
          border: 2px solid #991b1b;
          border-radius: 50%;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <div className="absolute top-4 start-4 z-[400] bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-sm flex items-center gap-3">
        <p className="font-medium text-foreground">
          {reportsWithLocation.length} {t("withLocation")}
        </p>
        {currentBbox && (
          <>
            <div className="w-px h-4 bg-border" />
            <Button size="sm" variant="default" onClick={handleSearchInArea} className="h-7 px-2 text-xs">
              Search this area
            </Button>
            {searchParams.has("bbox") && (
              <Button size="sm" variant="ghost" onClick={clearAreaSearch} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                Clear
              </Button>
            )}
          </>
        )}
      </div>

      <MapContainer
        center={centerPosition}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        style={{ background: "#0a0a0a" }}
      >
        <MapEvents />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          iconCreateFunction={createClusterIcon}
        >
          {reportsWithLocation.map((report) => (
            <Marker
              key={report._id}
              position={[
                report.location?.coordinates?.[1] as number,
                report.location?.coordinates?.[0] as number,
              ]}
              icon={redDotIcon}
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
