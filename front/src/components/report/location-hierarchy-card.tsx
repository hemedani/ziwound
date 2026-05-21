"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, MapPinned } from "lucide-react";
import { format } from "date-fns";

interface LocationHierarchyCardProps {
  crimeOccurredAt?: Date | string;
  hostileCountries?: Array<{ _id?: string; name?: string }>;
  attackedCountries?: Array<{ _id?: string; name?: string }>;
  attackedProvinces?: Array<{ _id?: string; name?: string }>;
  attackedCities?: Array<{ _id?: string; name?: string }>;
  translations: {
    crimeOccurredAt: string;
    hostileCountries: string;
    attackedCountries: string;
    attackedProvinces: string;
    attackedCities: string;
  };
  locale: string;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch {
    return "";
  }
}

function LocationSection({
  label,
  items,
  hrefPrefix,
  badgeColor = "bg-white/5 text-slate-body border-white/10 hover:bg-crimson/10 hover:text-crimson-light hover:border-crimson/20",
}: {
  label: string;
  items: Array<{ _id?: string; name?: string }>;
  hrefPrefix: string;
  badgeColor?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 hover:border-white/[0.08] transition-colors">
      <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Link key={item._id} href={`${hrefPrefix}/${item._id}`}>
            <Badge
              variant="outline"
              className={`${badgeColor} cursor-pointer transition-colors gap-1`}
            >
              {item.name}
              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LocationHierarchyCard({
  crimeOccurredAt,
  hostileCountries,
  attackedCountries,
  attackedProvinces,
  attackedCities,
  translations,
}: LocationHierarchyCardProps) {
  const hasContent =
    crimeOccurredAt ||
    hostileCountries?.length ||
    attackedCountries?.length ||
    attackedProvinces?.length ||
    attackedCities?.length;

  if (!hasContent) return null;

  return (
    <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-white/5 rounded-lg p-1.5">
          <MapPinned className="h-4 w-4 text-crimson" />
        </div>
        <h2 className="text-lg font-semibold text-offwhite">{translations.crimeOccurredAt ? translations.crimeOccurredAt.split(" ")[0] : "Crime Details"}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {crimeOccurredAt && (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 hover:border-white/[0.08] transition-colors">
            <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2">
              {translations.crimeOccurredAt}
            </p>
            <p className="font-medium text-offwhite flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              {formatDate(crimeOccurredAt)}
            </p>
          </div>
        )}

        <LocationSection
          label={translations.hostileCountries}
          items={hostileCountries || []}
          hrefPrefix="/explore/countries"
          badgeColor="bg-crimson/10 text-crimson-light border-crimson/20 hover:bg-crimson/20"
        />

        <LocationSection
          label={translations.attackedCountries}
          items={attackedCountries || []}
          hrefPrefix="/explore/countries"
          badgeColor="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
        />

        <LocationSection
          label={translations.attackedProvinces}
          items={attackedProvinces || []}
          hrefPrefix="/explore/provinces"
        />

        <LocationSection
          label={translations.attackedCities}
          items={attackedCities || []}
          hrefPrefix="/explore/cities"
        />
      </div>
    </div>
  );
}
