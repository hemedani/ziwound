import { FileText, Globe, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentHeroProps {
  totalDocuments: number;
  totalFiles: number;
  languagesCovered: number;
  translations: Record<string, string>;
}

export function DocumentHero({
  totalDocuments,
  totalFiles,
  languagesCovered,
  translations,
}: DocumentHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.10)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      {/* Subtle archival texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
        <p className="text-lg md:text-xl text-slate-body max-w-2xl leading-relaxed mb-8">
          {translations.description}
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-3">
          <Badge className="px-3.5 py-1.5 text-sm bg-crimson/10 text-crimson-light border-crimson/20">
            <FileText className="h-3.5 w-3.5 me-1.5" />
            {totalDocuments} {translations.documentsLabel}
          </Badge>
          <Badge className="px-3.5 py-1.5 text-sm bg-white/5 text-slate-body border-white/10">
            <FolderOpen className="h-3.5 w-3.5 me-1.5" />
            {totalFiles} {translations.filesLabel}
          </Badge>
          <Badge className="px-3.5 py-1.5 text-sm bg-white/5 text-slate-body border-white/10">
            <Globe className="h-3.5 w-3.5 me-1.5" />
            {languagesCovered} {translations.languagesLabel}
          </Badge>
        </div>
      </div>
    </div>
  );
}
