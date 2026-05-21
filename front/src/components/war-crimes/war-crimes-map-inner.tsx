"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { DeepPartial, reportSchema } from "@/types/declarations";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { createNeonMarkerIcon } from "@/components/map/neon-marker";

// Neon cluster icon — matches the neon marker aesthetic
const createClusterIcon = (cluster: { getChildCount: () => number }) => {
  const count = cluster.getChildCount();
  let size = 36;
  if (count >= 10 && count < 50) size = 44;
  else if (count >= 50 && count < 100) size = 52;
  else if (count >= 100) size = 60;

  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;background:rgba(239,68,68,0.85);border:2px solid rgba(239,68,68,0.6);border-radius:50%;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(239,68,68,0.6),0 0 32px rgba(239,68,68,0.3);">${count}</div>`,
    className: "custom-cluster-marker",
    iconSize: L.point(size, size),
  });
};

function getFirstImage(report: DeepPartial<reportSchema>): string | null {
  const docs = (report as { documents?: Array<{ documentFiles?: Array<{ name: string; mimeType: string; type: string }> }> }).documents;
  if (!docs) return null;
  for (const doc of docs) {
    for (const file of doc.documentFiles ?? []) {
      if (file.mimeType?.startsWith("image/") && file.name) {
        return getImageUploadUrl(file.name, (file.type as "image" | "video" | "docs") || "image");
      }
    }
  }
  return null;
}

interface WarCrimesMapProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
}

function MapEvents({ onMoveEnd }: { onMoveEnd: (bbox: number[]) => void }) {
  useMapEvents({
    moveend: (e) => {
      const bounds = e.target.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      onMoveEnd([sw.lng, sw.lat, ne.lng, ne.lat]);
    },
  });
  return null;
}

export default function WarCrimesMapInner({ reports, locale }: WarCrimesMapProps) {
  const t = useTranslations("warCrimes");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentBbox, setCurrentBbox] = useState<number[] | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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

  const handleMapMoveEnd = useCallback((bbox: number[]) => {
    setCurrentBbox(bbox);
  }, []);

  if (!mounted) return null;

  if (reportsWithLocation.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-slate-body/30 mx-auto mb-4" />
          <p className="text-lg text-slate-body/60 mb-1">{t("noResults")}</p>
          <p className="text-sm text-slate-body/40">{t("noResultsDescription")}</p>
        </div>
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
    <div className="relative h-[70vh] min-h-[500px] w-full rounded-2xl overflow-hidden border border-white/[0.06]">
      <style>{`
        .custom-marker { background: transparent !important; border: none !important; }
        .neon-leaflet-marker { background: transparent !important; border: none !important; }
        .custom-cluster-marker { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 10, 0.95) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          color: #f1f5f9 !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-tip {
          background: rgba(10, 10, 10, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: #cbd5e1 !important;
        }
        .leaflet-popup-close-button:hover {
          color: #f1f5f9 !important;
        }
        .leaflet-control-zoom a {
          background: rgba(10, 10, 10, 0.85) !important;
          color: #f1f5f9 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(30, 30, 30, 0.95) !important;
        }
      `}</style>

      {/* Map overlay info */}
      <div className="absolute top-4 start-4 z-[400] glass-strong rounded-xl px-3 py-2 text-sm shadow-sm flex items-center gap-3">
        <p className="font-medium text-offwhite">
          {reportsWithLocation.length} {t("withLocation")}
        </p>
        {currentBbox && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <Button size="sm" variant="default" onClick={handleSearchInArea} className="h-7 px-2 text-xs bg-crimson hover:bg-crimson-light">
              Search this area
            </Button>
            {searchParams.has("bbox") && (
              <Button size="sm" variant="ghost" onClick={clearAreaSearch} className="h-7 px-2 text-xs text-slate-body/60 hover:text-offwhite hover:bg-white/10">
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
        <MapEvents onMoveEnd={handleMapMoveEnd} />
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
          {reportsWithLocation.map((report) => {
            const imageUrl = getFirstImage(report);
            return (
              <Marker
                key={report._id}
                position={[
                  report.location?.coordinates?.[1] as number,
                  report.location?.coordinates?.[0] as number,
                ]}
                icon={createNeonMarkerIcon({
                  size: 32,
                  showIcon: true,
                  priority: report.priority as "High" | "Medium" | "Low" | undefined,
                })}
              >
                <Popup maxWidth={300}>
                  <div className="min-w-[240px]">
                    {imageUrl && (
                      <div className="relative h-28 -mx-3 -mt-3 mb-3 overflow-hidden rounded-t-xl">
                        <Image
                          src={imageUrl}
                          alt={report.title || ""}
                          fill
                          unoptimized
                          sizes="240px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.95)] to-transparent" />
                      </div>
                    )}
                    <h4 className="font-bold text-sm mb-1.5 leading-tight text-offwhite">{report.title}</h4>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {report.category && (
                        <Badge className="bg-white/5 text-slate-body border-white/10 text-[10px]">
                          {report.category.name}
                        </Badge>
                      )}
                      {report.priority && (
                        <Badge className={`text-[10px] ${
                          report.priority === "High" ? "bg-crimson/10 text-crimson-light border-crimson/20" :
                          report.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {report.priority}
                        </Badge>
                      )}
                    </div>
                    {report.address && (
                      <p className="text-xs text-slate-body/60 flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" />
                        {report.address}
                      </p>
                    )}
                    {report.crime_occurred_at && (
                      <p className="text-xs text-slate-body/60 flex items-center gap-1 mb-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.crime_occurred_at as string).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    )}
                    <Link
                      href={`/${locale}/reports/${report._id}`}
                      className="flex items-center justify-center gap-1.5 text-xs bg-crimson/20 text-crimson-light py-2 rounded-lg hover:bg-crimson/30 transition-colors font-medium"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
