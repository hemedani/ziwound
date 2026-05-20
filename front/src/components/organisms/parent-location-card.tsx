import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Globe, MapPin } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface ParentLocationCardProps {
  type: "country" | "province";
  label: string;
  name: string;
  englishName?: string;
  href: string;
  photo?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: "image" | "video" | "docs";
    alt_text?: string;
  };
  className?: string;
}

const typeIcons = {
  country: Globe,
  province: MapPin,
};

export function ParentLocationCard({
  type,
  label,
  name,
  englishName,
  href,
  photo,
  className,
}: ParentLocationCardProps) {
  const TypeIcon = typeIcons[type];
  const photoUrl = photo?.name ? getImageUploadUrl(photo.name, "image") : null;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-2xl glass-light border border-white/[0.06] p-4 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 ${className || ""}`}
    >
      {/* Photo */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.06]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            unoptimized
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
            <TypeIcon className="h-5 w-5 text-slate-body/20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-body/50 mb-0.5">{label}</p>
        <p className="text-base font-semibold text-offwhite group-hover:text-gold transition-colors truncate">
          {name}
        </p>
        {englishName && (
          <p className="text-xs text-slate-body/40 truncate">{englishName}</p>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="h-5 w-5 text-slate-body/20 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}
