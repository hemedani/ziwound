import { Globe, MapPin, Building2, FileText } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { extractLocalizedText, stripHtml } from "@/lib/localized-text";
import {
  GlassCard,
  GlassCardMedia,
  GlassCardTitleOverlay,
  GlassCardBadge,
  GlassCardContent,
  GlassCardDescription,
  GlassCardTags,
  GlassCardFooter,
  GlassCardCta,
} from "@/components/ui/glass-card";

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

  const typeIcon =
    type === "country" ? <Globe className="h-3 w-3" /> :
    type === "province" ? <MapPin className="h-3 w-3" /> :
    <Building2 className="h-3 w-3" />;

  // Build tags for stats with icons
  const tags: Array<{ name?: string; color?: string; icon?: React.ReactNode }> = [];
  if (provinceCount > 0) {
    tags.push({
      name: `${provinceCount} ${translations.provinces}`,
      icon: <MapPin className="h-2.5 w-2.5" />,
    });
  }
  if (cityCount > 0) {
    tags.push({
      name: `${cityCount} ${translations.cities}`,
      icon: <Building2 className="h-2.5 w-2.5" />,
    });
  }
  if (reportCount > 0) {
    tags.push({
      name: `${reportCount} ${translations.reports}`,
      color: "#f87171",
      icon: <FileText className="h-2.5 w-2.5" />,
    });
  }

  return (
    <GlassCard href={href}>
      <GlassCardMedia imageUrl={photoUrl} alt={location.name} fallback="grid" height="lg">
        {/* Type badge */}
        <GlassCardBadge position="top-start" variant="custom">
          <span className="flex items-center gap-1.5">
            {typeIcon}
            {typeLabel}
          </span>
        </GlassCardBadge>

        {/* Country breadcrumb for provinces/cities */}
        {location.country && (
          <GlassCardBadge position="top-end" variant="custom" color="text-gold">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              {location.country.name}
            </span>
          </GlassCardBadge>
        )}

        {/* Title overlay at bottom */}
        <GlassCardTitleOverlay className="p-5">
          <h3 className="text-2xl font-bold text-offwhite leading-tight group-hover:text-gold transition-colors duration-300">
            {location.name}
          </h3>
          <p className="text-sm text-slate-body/80 mt-1">{location.english_name}</p>
        </GlassCardTitleOverlay>
      </GlassCardMedia>

      <GlassCardContent className="p-5">
        {/* War info preview */}
        {(plainWars || plainCasualties) && (
          <div className="mb-4 space-y-1.5">
            {plainWars && (
              <GlassCardDescription text={plainWars} lines={2} className="mb-0" />
            )}
            {plainCasualties && (
              <p className="text-xs text-slate-body/50 line-clamp-1">{plainCasualties}</p>
            )}
          </div>
        )}

        {/* Stats */}
        <GlassCardTags tags={tags} />

      </GlassCardContent>

      {/* CTA */}
      <GlassCardFooter className="px-5">
        <div />
        <GlassCardCta text={translations.viewDetails} />
      </GlassCardFooter>
    </GlassCard>
  );
}
