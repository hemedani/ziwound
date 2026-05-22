import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight, Globe } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { cn } from "@/lib/utils";

interface LocationItem {
  _id: string;
  name: string;
  english_name: string;
  photo?: { name: string };
  provinces?: number;
  cities?: number;
  reportCount?: number;
}

interface ExploreLocationsProps {
  overline?: string;
  title: string;
  subtitle: string;
  viewAll?: string;
  viewAllHref?: string;
  locations: LocationItem[];
  locale: string;
  className?: string;
}

export function ExploreLocations({
  overline = "Explore Locations",
  title,
  subtitle,
  viewAll = "View All Countries",
  viewAllHref,
  locations,
  locale,
  className,
}: ExploreLocationsProps) {
  if (!locations.length) return null;

  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crimson/[0.015] to-transparent" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />

      <div className="mx-auto w-full max-w-7xl relative px-4 md:px-8">
        <div className="flex items-end justify-between mb-14">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-crimson" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
                {overline}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-slate-body leading-relaxed">{subtitle}</p>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-crimson hover:text-gold transition-colors group"
            >
              <span>{viewAll}</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location, i) => {
            const photoUrl = location.photo?.name
              ? getImageUploadUrl(location.photo.name, "image")
              : null;

            return (
              <Link
                key={location._id}
                href={`/${locale}/explore/countries/${location._id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-crimson/5 aspect-[4/5]"
              >
                {/* Photo */}
                <div className="absolute inset-0">
                  {photoUrl ? (
                    <>
                      <Image
                        src={photoUrl}
                        alt={location.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.03] via-white/[0.01] to-background">
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }} />
                    </div>
                  )}
                </div>

                {/* Neon-style location indicator */}
                <div className="absolute top-4 start-4 z-10">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10">
                    <MapPin className="h-3 w-3 text-crimson-light" />
                    <span className="text-[10px] font-medium text-offwhite uppercase tracking-wider">
                      {location.english_name}
                    </span>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="relative z-10 mt-auto p-5">
                  <h3 className="text-xl font-bold text-offwhite leading-tight mb-2 group-hover:text-gold transition-colors duration-300">
                    {location.name}
                  </h3>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(location.provinces ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-body/70 border border-white/[0.04]">
                        <MapPin className="h-2.5 w-2.5" />
                        {location.provinces} provinces
                      </span>
                    )}
                    {(location.cities ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-body/70 border border-white/[0.04]">
                        <Globe className="h-2.5 w-2.5" />
                        {location.cities} cities
                      </span>
                    )}
                    {(location.reportCount ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-crimson/10 px-2 py-0.5 text-[10px] text-crimson-light border border-crimson/20">
                        {location.reportCount} reports
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-crimson opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>View Details</span>
                    <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile view all */}
        {viewAllHref && (
          <div className="mt-8 text-center lg:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-crimson hover:text-gold transition-colors"
            >
              <span>{viewAll}</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
