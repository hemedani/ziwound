import { ArrowLeft, Users, FileText, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ReporterHeroProps {
  locale: string;
  totalReporters: number;
  totalReports: number;
  countriesCovered: number;
  backToHomeLabel: string;
  overlineLabel: string;
  title: string;
  subtitle: string;
  reportersLabel: string;
  reportsSubmittedLabel: string;
  countriesCoveredLabel: string;
}

export function ReporterHero({
  locale,
  totalReporters,
  totalReports,
  countriesCovered,
  backToHomeLabel,
  overlineLabel,
  title,
  subtitle,
  reportersLabel,
  reportsSubmittedLabel,
  countriesCoveredLabel,
}: ReporterHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Radial gradient background */}
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

      <div className="container relative px-4 md:px-8 pt-32 pb-16">
        {/* Back button */}
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-slate-body/70 hover:text-offwhite hover:bg-white/5 -ms-2 transition-colors"
        >
          <Link href={`/${locale}`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {backToHomeLabel}
          </Link>
        </Button>

        {/* Overline */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-crimson to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {overlineLabel}
          </span>
          <Users className="h-3.5 w-3.5 text-gold/60" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite mb-3 leading-[1.1] tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-slate-body/70 mb-8 max-w-2xl">
          {subtitle}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <Badge className="px-4 py-2 text-sm bg-crimson/10 text-crimson-light border-crimson/20 gap-2">
            <Users className="h-4 w-4" />
            {totalReporters} {reportersLabel}
          </Badge>
          <Badge className="px-4 py-2 text-sm bg-white/5 text-slate-body border-white/10 gap-2">
            <FileText className="h-4 w-4" />
            {totalReports} {reportsSubmittedLabel}
          </Badge>
          <Badge className="px-4 py-2 text-sm bg-gold/10 text-gold border-gold/20 gap-2">
            <Globe className="h-4 w-4" />
            {countriesCovered} {countriesCoveredLabel}
          </Badge>
        </div>
      </div>
    </div>
  );
}
