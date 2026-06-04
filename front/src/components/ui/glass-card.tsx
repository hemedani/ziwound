"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   Colour config maps — single source of truth for all cards
   ═══════════════════════════════════════════════════════════════ */

export const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Pending:  { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20", dot: "bg-amber-400" },
  Rejected: { bg: "bg-crimson/10",     text: "text-crimson-light", border: "border-crimson/20", dot: "bg-crimson-light" },
  InReview: { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20", dot: "bg-blue-400" },
};

export const priorityConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  High:   { bg: "bg-crimson/10",     text: "text-crimson-light", border: "border-crimson/20", dot: "bg-crimson-light" },
  Medium: { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20", dot: "bg-amber-400" },
  Low:    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
};

export const levelConfig: Record<string, { bg: string; text: string; border: string }> = {
  Reporter:   { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20" },
  Editor:     { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20" },
  Researcher: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  Diplomat:   { bg: "bg-gold/10",       text: "text-gold",       border: "border-gold/20" },
  Artist:     { bg: "bg-pink-500/10",   text: "text-pink-400",   border: "border-pink-500/20" },
  Manager:    { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20" },
  Ordinary:   { bg: "bg-white/5",       text: "text-slate-body", border: "border-white/10" },
};

export const affiliationConfig: Record<string, string> = {
  Military: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Paramilitary: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Government: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Rebel Group": "bg-red-500/20 text-red-400 border-red-500/30",
  "Private Military Company": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Political: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

/* ═══════════════════════════════════════════════════════════════
   Root GlassCard
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardProps {
  href?: string;
  children: ReactNode;
  className?: string;
  animate?: boolean;
  index?: number;
  layout?: "vertical" | "horizontal";
}

export function GlassCard({ href, children, className, animate, index = 0, layout = "vertical" }: GlassCardProps) {
  const inner = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-white/[0.03] backdrop-blur-xl",
        "border border-white/[0.22]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.10)]",
        "transition-all duration-500",
        "hover:-translate-y-1 hover:border-white/[0.32] hover:bg-white/[0.05]",
        "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_20px_40px_-10px_rgba(153,27,27,0.15)]",
        layout === "horizontal" && "flex flex-col sm:flex-row",
        className
      )}
    >
      {children}
    </div>
  );

  const linked = href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
      >
        {linked}
      </motion.div>
    );
  }

  return linked;
}

/* ═══════════════════════════════════════════════════════════════
   Media (top image area)
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardMediaProps {
  imageUrl?: string | null;
  alt?: string;
  fallback?: "map" | "grid" | "icon";
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  height?: "sm" | "md" | "lg";
}

export function GlassCardMedia({ imageUrl, alt = "", fallback = "grid", icon, children, className, height = "md" }: GlassCardMediaProps) {
  const heightClass = height === "sm" ? "h-40" : height === "lg" ? "h-56" : "h-48";

  const hasCustomContent = !!children;

  return (
    <div className={cn("relative w-full overflow-hidden border-b border-white/[0.08]", heightClass, className)}>
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </>
      ) : !hasCustomContent ? (
        <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.03] via-white/[0.015] to-background">
          {fallback === "icon" && icon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/[0.12]">
                  {icon}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TitleOverlay
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardTitleOverlayProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardTitleOverlay({ children, className }: GlassCardTitleOverlayProps) {
  return (
    <div className={cn("absolute inset-x-0 bottom-0 p-4", className)}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Badge
   ═══════════════════════════════════════════════════════════════ */

export type GlassCardBadgePosition = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "inline";
export type GlassCardBadgeVariant = "status" | "priority" | "category" | "type" | "language" | "custom";

export interface GlassCardBadgeProps {
  position?: GlassCardBadgePosition;
  variant?: GlassCardBadgeVariant;
  value?: string;
  color?: string;
  children?: ReactNode;
  className?: string;
}

export function GlassCardBadge({ position = "top-start", variant = "custom", value, color, children, className }: GlassCardBadgeProps) {
  const positionClass = {
    "top-start": "absolute start-3 top-3",
    "top-end": "absolute end-3 top-3",
    "bottom-start": "absolute start-3 bottom-3",
    "bottom-end": "absolute end-3 bottom-3",
    inline: "",
  }[position];

  let inner = children;

  if (variant === "status" && value) {
    const cfg = statusConfig[value] || statusConfig.Pending;
    inner = (
      <span className={cn("flex items-center gap-1.5", className)}>
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot || "bg-current"}`} />
        {value}
      </span>
    );
  } else if (variant === "priority" && value) {
    const cfg = priorityConfig[value] || priorityConfig.Low;
    inner = (
      <span className={cn("flex items-center gap-1.5", className)}>
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {value}
      </span>
    );
  } else if (variant === "custom" && value) {
    inner = <span className={className}>{value}</span>;
  }

  return (
    <div className={positionClass}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap",
          "bg-black/40 backdrop-blur-xl",
          "border border-white/[0.20]",
          "shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
          "text-offwhite",
          "[text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
          color
        )}
      >
        {inner}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Content
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardContentProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return (
    <div className={cn("flex flex-1 flex-col p-4", className)}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Description
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardDescriptionProps {
  text?: string;
  html?: string;
  lines?: 2 | 3;
  className?: string;
}

export function GlassCardDescription({ text, html, lines = 2, className }: GlassCardDescriptionProps) {
  const lineClass = lines === 3 ? "line-clamp-3" : "line-clamp-2";

  if (html) {
    return (
      <div
        className={cn(
          `text-sm text-slate-body/70 ${lineClass} leading-relaxed mb-3`,
          "prose prose-invert prose-sm max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-sm prose-strong:text-slate-body/70 prose-a:text-crimson-light",
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (text) {
    return (
      <p className={cn(`text-sm text-slate-body/70 ${lineClass} leading-relaxed mb-3`, className)}>
        {text}
      </p>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   Tags
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardTagItem {
  _id?: string;
  name?: string;
  color?: string;
  icon?: ReactNode;
}

export interface GlassCardTagsProps {
  tags?: GlassCardTagItem[];
  max?: number;
  className?: string;
}

export function GlassCardTags({ tags, max = 3, className }: GlassCardTagsProps) {
  if (!tags || tags.length === 0) return null;

  const visible = tags.slice(0, max);
  const overflow = tags.length - max;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((tag) => (
        <span
          key={tag._id || tag.name}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium",
            "bg-white/[0.08] backdrop-blur-md",
            "border border-white/[0.18]",
            "text-slate-body/80",
            "shadow-[0_0_8px_rgba(255,255,255,0.03)]"
          )}
          style={tag.color ? { borderColor: `${tag.color}35`, color: tag.color } : undefined}
        >
          {tag.icon && <span className="opacity-70">{tag.icon}</span>}
          {tag.name}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium",
            "bg-white/[0.05] backdrop-blur-md",
            "border border-white/[0.12]",
            "text-slate-body/50"
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Meta
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardMetaProps {
  icon?: ReactNode;
  text?: string;
  children?: ReactNode;
  className?: string;
}

export function GlassCardMeta({ icon, text, children, className }: GlassCardMetaProps) {
  if (!text && !children) return null;
  return (
    <div className={cn("flex items-center gap-1 text-xs text-slate-body/50", className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {text && <span className="truncate">{text}</span>}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div className={cn("flex items-center justify-between pt-4 pb-4 border-t border-white/[0.04]", className)}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Cta
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardCtaProps {
  text?: string;
  icon?: ReactNode;
  className?: string;
}

export function GlassCardCta({ text = "View", icon, className }: GlassCardCtaProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm font-medium text-crimson transition-all duration-300",
        className
      )}
    >
      <span className="inline-flex items-center leading-none">{text}</span>
      {icon || (
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Avatar
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardAvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  verified?: boolean;
  className?: string;
  fallback?: ReactNode;
}

export function GlassCardAvatar({ src, alt = "", initials, size = "md", verified, className, fallback }: GlassCardAvatarProps) {
  const sizeClass = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-16 w-16",
  }[size];

  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5", sizeClass, className)}>
      {src ? (
        <Image src={src} alt={alt} fill unoptimized sizes={size === "lg" ? "64px" : size === "md" ? "56px" : "40px"} className="object-cover" />
      ) : fallback ? (
        <div className="flex h-full w-full items-center justify-center">{fallback}</div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-body/50">
          {initials || "?"}
        </div>
      )}
      {verified && (
        <div className="absolute -bottom-0.5 -end-0.5 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Stats
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardStatItem {
  icon: ReactNode;
  value: number | string;
  label: string;
}

export interface GlassCardStatsProps {
  items: GlassCardStatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function GlassCardStats({ items, columns = 3, className }: GlassCardStatsProps) {
  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-3 mb-4", gridClass, className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-lg bg-white/[0.03] border border-white/[0.04] py-2 px-1"
        >
          <span className="text-slate-body/50 mb-1">{item.icon}</span>
          <span className="text-sm font-bold text-offwhite">{item.value}</span>
          <span className="text-[10px] text-slate-body/50">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   List / ListItem
   ═══════════════════════════════════════════════════════════════ */

export interface GlassCardListProps {
  children: ReactNode;
  className?: string;
}

export function GlassCardList({ children, className }: GlassCardListProps) {
  return (
    <div className={cn("rounded-2xl glass-light border border-white/[0.06] overflow-hidden", className)}>
      {children}
    </div>
  );
}

export interface GlassCardListItemProps {
  href?: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function GlassCardListItem({ href, icon, title, subtitle, badge, children, className }: GlassCardListItemProps) {
  const inner = (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors group/item",
        className
      )}
    >
      {icon && (
        <div className="shrink-0 rounded-lg bg-white/[0.03] p-2 border border-white/[0.04]">
          <span className="text-slate-body/40 group-hover/item:text-crimson-light transition-colors">
            {icon}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-offwhite truncate group-hover/item:text-gold transition-colors">
          {title}
        </p>
        {subtitle && (
          <div
            className="text-xs text-slate-body/40 mt-0.5 line-clamp-1 prose prose-invert prose-xs max-w-none prose-p:m-0 prose-p:inline"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
      <ChevronRight className="h-4 w-4 text-slate-body/20 shrink-0 transition-transform duration-300 group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5 rtl:rotate-180" />
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
