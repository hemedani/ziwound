import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Building2 } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface RelatedLocation {
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
  wars_history?: Record<string, string>;
  casualties_info?: Record<string, string>;
}

interface RelatedLocationsGridProps {
  locations: RelatedLocation[];
  locale: string;
  type: "province" | "city";
  title: string;
  hrefPrefix: string;
  className?: string;
}

const typeIcons = {
  province: MapPin,
  city: Building2,
};

function extractPreview(
  field: Record<string, string> | undefined,
  locale: string
): string {
  if (!field) return "";
  const text = field[locale] || field.en || "";
  return text.replace(/<[^>]*>/g, "").trim().slice(0, 80);
}

export function RelatedLocationsGrid({
  locations,
  locale,
  type,
  title,
  hrefPrefix,
  className,
}: RelatedLocationsGridProps) {
  const TypeIcon = typeIcons[type];

  if (locations.length === 0) return null;

  return (
    <div className={`rounded-2xl glass-light border border-white/[0.06] overflow-hidden ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
        <TypeIcon className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-semibold text-offwhite">{title}</h3>
        <span className="text-xs text-slate-body/40 ms-auto">{locations.length}</span>
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.04]">
        {locations.map((location) => {
          const photoUrl = location.photo?.name
            ? getImageUploadUrl(location.photo.name, "image")
            : null;
          const preview = extractPreview(
            location.wars_history || location.casualties_info,
            locale
          );

          return (
            <Link
              key={location._id}
              href={`${hrefPrefix}/${location._id}`}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
            >
              {/* Photo thumbnail */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/[0.06]">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={location.name}
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                    <TypeIcon className="h-4 w-4 text-slate-body/20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-offwhite group-hover:text-gold transition-colors truncate">
                  {location.name}
                </p>
                <p className="text-xs text-slate-body/50 truncate">{location.english_name}</p>
                {preview && (
                  <p className="text-xs text-slate-body/30 mt-0.5 line-clamp-1">
                    {preview}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 text-slate-body/20 shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
