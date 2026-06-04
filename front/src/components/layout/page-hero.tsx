import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PageHeroProps {
  icon?: ReactNode;
  overline?: string;
  title: string;
  description?: string;
  backLink?: { href: string; label: string };
  children?: ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

export function PageHero({
  icon,
  overline,
  title,
  description,
  backLink,
  children,
  variant = "default",
  className,
}: PageHeroProps) {
  const isCompact = variant === "compact";

  return (
    <header
      className={cn(
        "relative w-full overflow-hidden",
        /* Pull the hero up to cancel the locale layout pt-16. */
        "-mt-16",
        className
      )}
    >
      {/* 1. Crimson radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.12)_0%,_transparent_70%)]" />

      {/* 2. Gold accent glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />

      {/* 3. Frosted-glass blur over the PageContainer mesh behind */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm pointer-events-none" />

      {/* Content */}
      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          /* Extra top padding clears the fixed header (h-16). */
          isCompact
            ? "pt-20 sm:pt-24 pb-6 sm:pb-8"
            : "pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 lg:pb-12"
        )}
      >
        {/* Optional back link */}
        {backLink && (
          <div className="mb-4">
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-1.5 text-sm text-slate-body/70 hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              <span>{backLink.label}</span>
            </Link>
          </div>
        )}

        {/* Overline: icon + red line + gold text */}
        {(icon || overline) && (
          <div className="mb-4 flex items-center gap-3">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson/10 border border-crimson/20 shadow-lg shadow-crimson/5">
                {icon}
              </div>
            )}
            {overline && (
              <>
                <div className="h-px w-8 bg-gradient-to-r rtl:bg-gradient-to-l from-crimson to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {overline}
                </span>
              </>
            )}
          </div>
        )}

        {/* Title */}
        <h1
          className={cn(
            "font-bold text-offwhite leading-[1.1] tracking-tight text-glow-crimson",
            isCompact
              ? "text-2xl md:text-3xl"
              : "text-4xl md:text-5xl lg:text-6xl"
          )}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl text-slate-body max-w-2xl leading-relaxed mt-3 sm:mt-4">
            {description}
          </p>
        )}

        {/* Extra content (stat frames, search bars, etc.) */}
        {children && <div className="mt-6 sm:mt-8">{children}</div>}
      </div>

      {/* Neon separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
        <div
          className="w-full h-px bg-gradient-to-r from-transparent via-crimson/35 to-transparent header-neon-pulse"
          style={{
            animation: "headerNeonPulse 4s ease-in-out infinite",
            boxShadow: "0 0 8px 1px rgba(153,27,27,0.12)",
          }}
        />
      </div>
    </header>
  );
}
