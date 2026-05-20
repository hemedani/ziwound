import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, FileText, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { extractLocalizedText, stripHtml } from "@/lib/localized-text";

type Language = "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru";

interface LocationData {
  _id?: string;
  name: string;
  english_name: string;
  photo?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: "image" | "video" | "docs";
    alt_text?: string;
  };
  wars_history?: Record<Language, string>;
  casualties_info?: Record<Language, string>;
  provinces?: Array<{ _id?: string; name: string }>;
  cities?: Array<{ _id?: string; name: string }>;
  hostileReports?: Array<{ _id?: string }>;
  attackedReports?: Array<{ _id?: string }>;
  attackedByReports?: Array<{ _id?: string }>;
  country?: { _id?: string; name: string };
}

interface LocationCardProps {
  location: LocationData;
  locale: string;
  type: "country" | "province" | "city";
  translations: Record<string, string>;
}

export function LocationCard({ location, locale, type, translations }: LocationCardProps) {
  const href =
    type === "country"
      ? `/${locale}/explore/countries/${location._id}`
      : type === "province"
        ? `/${locale}/explore/provinces/${location._id}`
        : `/${locale}/explore/cities/${location._id}`;

  const warsPreview = extractLocalizedText(location.wars_history, locale);
  const casualtiesPreview = extractLocalizedText(location.casualties_info, locale);
  const plainWars = stripHtml(warsPreview);
  const plainCasualties = stripHtml(casualtiesPreview);

  const provinceCount = location.provinces?.length || 0;
  const cityCount = location.cities?.length || 0;
  const reportCount =
    (location.hostileReports?.length || 0) +
    (location.attackedReports?.length || 0) +
    (location.attackedByReports?.length || 0);

  const photoUrl = location.photo?.name
    ? getImageUploadUrl(location.photo.name, "image")
    : null;

  const typeLabel =
    type === "country"
      ? translations.country
      : type === "province"
        ? translations.province
        : translations.city;

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-crimson/5"
    >
      {/* Photo */}
      <div className="relative h-56 w-full overflow-hidden">
        {photoUrl ? (
          <>
            <Image
              src={photoUrl}
              alt={location.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01]" />
        )}

        {/* Type badge */}
        <div className="absolute start-4 top-4">
          <Badge className="bg-black/40 text-offwhite backdrop-blur-md border border-white/10">
            {typeLabel}
          </Badge>
        </div>

        {/* Country breadcrumb for provinces/cities */}
        {location.country && (
          <div className="absolute end-4 top-4">
            <Badge className="bg-black/40 text-gold backdrop-blur-md border border-white/10">
              <Globe className="h-3 w-3 me-1" />
              {location.country.name}
            </Badge>
          </div>
        )}

        {/* Bottom gradient overlay with name */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-2xl font-bold text-offwhite leading-tight group-hover:text-gold transition-colors duration-300">
            {location.name}
          </h3>
          <p className="text-sm text-slate-body/80 mt-1">{location.english_name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* War info preview */}
        {(plainWars || plainCasualties) && (
          <div className="mb-4 space-y-1.5">
            {plainWars && (
              <p className="text-sm text-slate-body/70 line-clamp-2 leading-relaxed">
                {plainWars}
              </p>
            )}
            {plainCasualties && (
              <p className="text-xs text-slate-body/50 line-clamp-1">
                {plainCasualties}
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-auto flex flex-wrap gap-2">
          {provinceCount > 0 && (
            <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-body">
              <MapPin className="h-3 w-3 me-1" />
              {provinceCount} {translations.provinces}
            </Badge>
          )}
          {cityCount > 0 && (
            <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-body">
              <Globe className="h-3 w-3 me-1" />
              {cityCount} {translations.cities}
            </Badge>
          )}
          {reportCount > 0 && (
            <Badge className="bg-crimson/10 text-crimson-light border-crimson/20">
              <FileText className="h-3 w-3 me-1" />
              {reportCount} {translations.reports}
            </Badge>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-crimson opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span>{translations.viewDetails}</span>
          <ChevronRight className="h-4 w-4 transition-transform duration-300 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
