import { Search, X, FileText, Globe, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WarCrimesHeroProps {
  locale: string;
  search: string;
  totalCount: number;
  countriesInvolved: number;
  languagesCount: number;
  translations: Record<string, string>;
}

export function WarCrimesHero({
  locale,
  search,
  totalCount,
  countriesInvolved,
  languagesCount,
  translations,
}: WarCrimesHeroProps) {
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
          <div className="h-px w-10 bg-gradient-to-r rtl:bg-gradient-to-l from-crimson to-transparent" />
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

        {/* Quick stats */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Badge className="px-3.5 py-1.5 text-sm bg-crimson/10 text-crimson-light border-crimson/20">
            <FileText className="h-3.5 w-3.5 me-1.5" />
            {totalCount} {translations.totalReports || "Reports"}
          </Badge>
          <Badge className="px-3.5 py-1.5 text-sm bg-white/5 text-slate-body border-white/10">
            <Globe className="h-3.5 w-3.5 me-1.5" />
            {countriesInvolved} {translations.countriesInvolved || "Countries"}
          </Badge>
          <Badge className="px-3.5 py-1.5 text-sm bg-white/5 text-slate-body border-white/10">
            <MapPin className="h-3.5 w-3.5 me-1.5" />
            {languagesCount} {translations.languages || "Languages"}
          </Badge>
        </div>

        {/* Search bar */}
        <form method="GET" className="max-w-2xl">
          <input type="hidden" name="view" value="list" />
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
                <a href={`/${locale}/war-crimes`}>
                  <X className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              type="submit"
              className="h-10 px-6 bg-crimson hover:bg-crimson-light text-white font-medium rounded-xl transition-all duration-300"
            >
              {translations.search || "Search"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
