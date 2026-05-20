import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Globe, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: typeof Globe;
}

interface StatBadge {
  icon?: typeof Globe;
  value: number;
  label: string;
  variant?: "default" | "crimson";
}

interface LocationHeroProps {
  locale: string;
  type: "country" | "province" | "city";
  name: string;
  englishName: string;
  photo?: {
    _id?: string;
    name: string;
    mimeType: string;
    type: "image" | "video" | "docs";
    alt_text?: string;
  };
  breadcrumbs: BreadcrumbItem[];
  stats: StatBadge[];
  typeLabel: string;
  backToExploreLabel: string;
}

const typeIcons = {
  country: Globe,
  province: MapPin,
  city: Building2,
};

export function LocationHero({
  locale,
  type,
  name,
  englishName,
  photo,
  breadcrumbs,
  stats,
  typeLabel,
  backToExploreLabel,
}: LocationHeroProps) {
  const TypeIcon = typeIcons[type];
  const photoUrl = photo?.name ? getImageUploadUrl(photo.name, "image") : null;

  return (
    <div className="relative overflow-hidden">
      {/* Background image or gradient */}
      {photoUrl ? (
        <>
          <Image
            src={photoUrl}
            alt={name}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Multi-layer dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
          {/* Crimson glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,_rgba(153,27,27,0.12)_0%,_transparent_70%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.10)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </>
      )}

      <div className="container relative px-4 md:px-8 pt-32 pb-16">
        {/* Back to explore */}
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-slate-body/70 hover:text-offwhite hover:bg-white/5 -ms-2 transition-colors"
        >
          <Link href={`/${locale}/explore`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {backToExploreLabel}
          </Link>
        </Button>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-6 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => {
              const CrumbIcon = crumb.icon;
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-body/30 rtl:rotate-180" />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="flex items-center gap-1.5 text-slate-body/60 hover:text-gold transition-colors"
                    >
                      {CrumbIcon && <CrumbIcon className="h-3.5 w-3.5" />}
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-body/80">
                      {CrumbIcon && <CrumbIcon className="h-3.5 w-3.5" />}
                      {crumb.label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {/* Type overline */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-crimson to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {typeLabel}
          </span>
          <TypeIcon className="h-3.5 w-3.5 text-gold/60" />
        </div>

        {/* Name */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite mb-3 leading-[1.1] tracking-tight">
          {name}
        </h1>
        <p className="text-lg md:text-xl text-slate-body/70 mb-8">{englishName}</p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <Badge
                  key={i}
                  className={`px-3.5 py-1.5 text-sm ${
                    stat.variant === "crimson"
                      ? "bg-crimson/10 text-crimson-light border-crimson/20"
                      : "bg-white/5 text-slate-body border-white/10"
                  }`}
                >
                  {StatIcon && <StatIcon className="h-3.5 w-3.5 me-1.5" />}
                  {stat.value} {stat.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
