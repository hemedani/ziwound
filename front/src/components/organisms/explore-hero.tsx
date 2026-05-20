import { Search, X, Globe, MapPin, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type LocationType = "countries" | "provinces" | "cities";

interface ExploreHeroProps {
  locale: string;
  search: string;
  activeTab: LocationType;
  translations: Record<string, string>;
}

export function ExploreHero({ locale, search, activeTab, translations }: ExploreHeroProps) {
  const tabs: { key: LocationType; icon: typeof Globe; label: string }[] = [
    { key: "countries", icon: Globe, label: translations.countriesTab || "Countries" },
    { key: "provinces", icon: MapPin, label: translations.provincesTab || "Provinces" },
    { key: "cities", icon: Building2, label: translations.citiesTab || "Cities" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.10)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative px-4 md:px-8 pt-32 pb-12">
        {/* Overline */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-crimson to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {translations.overline}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite mb-4 leading-[1.1] tracking-tight">
          {translations.title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-body max-w-2xl leading-relaxed mb-10">
          {translations.description}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(({ key, icon: Icon, label }) => {
            const isActive = activeTab === key;
            const href = `/${locale}/explore${key === "countries" ? "" : `?tab=${key}`}`;
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "ghost"}
                asChild
                className={`h-10 px-5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-crimson/15 text-crimson-light border border-crimson/30 hover:bg-crimson/20"
                    : "text-slate-body hover:text-offwhite hover:bg-white/5 border border-transparent"
                }`}
              >
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Search bar */}
        <form method="GET" className="max-w-2xl">
          <input type="hidden" name="tab" value={activeTab} />
          <div className="relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-1.5 transition-all duration-300 focus-within:border-crimson/40 focus-within:bg-white/[0.06] focus-within:shadow-lg focus-within:shadow-crimson/5">
            <Search className="absolute start-5 h-5 w-5 text-slate-body/50 pointer-events-none" />
            <Input
              name="search"
              placeholder={translations.searchPlaceholder}
              defaultValue={search}
              className="flex-1 border-0 bg-transparent ps-12 pe-12 h-12 text-offwhite placeholder:text-slate-body/40 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                asChild
                className="absolute end-14 h-8 w-8 text-slate-body/50 hover:text-offwhite hover:bg-white/10"
              >
                <Link href={`/${locale}/explore${activeTab !== "countries" ? `?tab=${activeTab}` : ""}`}>
                  <X className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              type="submit"
              className="h-10 px-6 bg-crimson hover:bg-crimson-light text-white font-medium rounded-xl transition-all duration-300"
            >
              {translations.search}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
