# ZiWound Unified Glass Card Component — Implementation Prompt

> **Version:** 1.2  
> **Goal:** Replace every bespoke card across the public-facing pages with a single, beautiful, configurable `GlassCard` component that honors the ZiWound dark glass aesthetic.  
> **Scope:** All public `/[locale]/*` pages (NOT admin panel cards, which have their own dense data-table concerns).

---

## 1. Card Audit (What Exists Today)

The following card components were found in the codebase. Every one duplicates the same glass styling by hand:

| Component | File | Layout | Key Features |
|-----------|------|--------|--------------|
| `ReportCard` | `src/components/war-crimes/report-card.tsx` | Vertical, image top | Image/map fallback, status + priority badges, location tags, date footer |
| `DocumentCard` | `src/components/documents/document-card.tsx` | Vertical, image top | Thumbnail preview, file-type badge, language badge, linked reports, file list + download |
| `LocationCard` | `src/components/organisms/location-card.tsx` | Vertical, image top | Photo, type badge, country breadcrumb, war-info preview, province/city/report stats |
| `ReporterCard` | `src/components/reporters/reporter-card.tsx` | Horizontal, avatar left | Avatar with verified dot, level badge, bio, 3-stat grid, country badges |
| `WarCriminalCard` | `src/components/report/war-criminal-card.tsx` | Horizontal, photo left | Photo, status + affiliation badges, nationality, aliases, known-for, description |
| `LinkedReportCard` | `src/components/documents/linked-report-card.tsx` | Compact vertical | Header icon, title + status, description, metadata row, CTA button |
| `ReportListCard` | `src/components/organisms/report-list-card.tsx` | List container | Header with count, list of report rows with status pill + arrow |
| `ParentLocationCard` | `src/components/organisms/parent-location-card.tsx` | Horizontal compact | Thumbnail, label + name + englishName, arrow |
| Blog article (inline) | `src/app/[locale]/blog/page.tsx` | Vertical, image top | Cover image, tags, title, author/date meta, excerpt, read-more |
| Timeline card (inline) | `src/components/war-crimes/war-crimes-timeline.tsx` | Vertical, image top | Same as report-card but used inline |

---

## 2. Design Tokens (The ZiWound Glass Language)

Do NOT invent new colours. These are the canonical tokens already in use:

| Token | Value | Usage |
|-------|-------|-------|
| Card radius | `rounded-2xl` (1rem) | Always |
| Card border | `border-white/[0.22]` | Bright enough to be visible on both dark and light images |
| Card bg | `bg-white/[0.03] backdrop-blur-xl` | **CRITICAL:** `bg-white/[0.02]` is INVISIBLE. Minimum `0.03` + strong blur |
| Card inner glow | `shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.10)]` | Subtle top-edge highlight + outer ring |
| Card hover | `hover:border-white/[0.32] hover:bg-white/[0.05] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_20px_40px_-10px_rgba(153,27,27,0.15)]` | Elevated glass on hover |
| Media separator | `border-b border-white/[0.08]` | Divider between image area and content |
| Badge style | `bg-white/[0.10] backdrop-blur-xl border border-white/[0.20] rounded-full` | Pill-shaped glass badge |
| Badge glow | `shadow-[0_0_12px_rgba(255,255,255,0.04)]` | Subtle halo |
| Tag style | `bg-white/[0.08] backdrop-blur-md border border-white/[0.18] rounded-full` | Smaller pill tags with icons |
| Image overlay | `bg-gradient-to-t from-background via-background/50 to-transparent` | Over images for text readability |
| Fallback grid | `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)` `backgroundSize: 20px` | When no image/map |
| Title hover | `group-hover:text-gold` | All card titles |
| CTA reveal | `opacity-0 group-hover:opacity-100` | Footer "View" link |

### 2.1 Why `bg-white/[0.02]` Fails

`bg-white/[0.02]` is 2% white opacity. On a `#0a0a0a` background this is mathematically indistinguishable from transparent. The mesh grid behind the card bleeds through and the card appears to not exist. **Always use `bg-white/[0.03] backdrop-blur-xl` minimum.**

### 2.2 Masonry for Varying Heights

Standard CSS Grid (`grid-cols-3`) forces every card in a row to the height of the tallest card, creating huge empty gaps. Use CSS Columns for natural masonry flow:

```tsx
// Parent container
<div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
  {items.map((item) => (
    <div key={item._id} className="break-inside-avoid mb-5">
      <GlassCard ... />
    </div>
  ))}
</div>
```

- `columns-3` creates 3 vertical columns
- `break-inside-avoid` prevents a card from splitting across columns
- Cards flow naturally top-to-bottom, each with its own true height

---

## 3. The Unified `GlassCard` Component

Create **`src/components/ui/glass-card.tsx`**.

### 3.1 Architecture (Named Exports)

Use explicit named exports (NOT compound `Object.assign`). Turbopack has issues with property assignment on functions:

```tsx
import {
  GlassCard,
  GlassCardMedia,
  GlassCardBadge,
  GlassCardContent,
  GlassCardDescription,
  GlassCardTags,
  GlassCardFooter,
  GlassCardCta,
} from "@/components/ui/glass-card";

<GlassCard href={`/${locale}/reports/${report._id}`}>
  <GlassCardMedia imageUrl={imageUrl} fallback="map">
    <GlassCardBadge position="top-start" variant="status" value="Approved" />
    <GlassCardBadge position="top-end" variant="priority" value="High" />
    <GlassCardTitleOverlay>{report.title}</GlassCardTitleOverlay>
  </GlassCardMedia>

  <GlassCardContent>
    <GlassCardDescription html={report.description} />
    <GlassCardTags tags={report.tags} max={3} />
    <GlassCardFooter>
      <GlassCardMeta icon={<Calendar />} text={date} />
      <GlassCardCta text={t("view")} />
    </GlassCardFooter>
  </GlassCardContent>
</GlassCard>
```

### 3.2 Sub-Components to Export

| Sub-component | Props | Responsibility |
|---------------|-------|----------------|
| `GlassCard` | `href?: string; children; className?; animate?: boolean; index?: number; layout?: "vertical" \| "horizontal"` | Root wrapper. If `href` provided, renders as `<Link>`. Wraps in `framer-motion` when `animate=true`. |
| `GlassCardMedia` | `imageUrl?: string \| null; alt?: string; fallback?: "map" \| "grid" \| "icon"; icon?: ReactNode; children?; height?: "sm" \| "md" \| "lg"` | Top image area. Handles `<Image fill>`, gradient overlay, fallback grid. Has `border-b` separator. |
| `GlassCardTitleOverlay` | `children; className?` | Absolutely positioned at bottom of Media. |
| `GlassCardBadge` | `position: "top-start" \| "top-end" \| "bottom-start" \| "bottom-end"; variant: "status" \| "priority" \| "custom"; value?: string; color?: string; children?: ReactNode` | Beautiful pill badge with icon + text. Renders dot for status/priority. Custom allows any child with icon. |
| `GlassCardContent` | `children; className?` | Padded content area. |
| `GlassCardDescription` | `text?: string; html?: string; lines?: 2 \| 3; className?` | Clamped description. |
| `GlassCardTags` | `tags?: Array<{_id?, name?, color?, icon?: ReactNode}>; max?: number` | Renders pill tags with optional icons. |
| `GlassCardMeta` | `icon?: ReactNode; text?: string; children?` | Small text row. |
| `GlassCardFooter` | `children; className?` | Bottom row with top border. |
| `GlassCardCta` | `text?: string; icon?: ReactNode` | Right-aligned chevron. |

### 3.3 Colour Config Maps

```ts
export const statusConfig = {
  Approved:  { dot: "bg-emerald-400" },
  Pending:   { dot: "bg-amber-400" },
  Rejected:  { dot: "bg-crimson-light" },
  InReview:  { dot: "bg-blue-400" },
};

export const priorityConfig = {
  High:   { dot: "bg-crimson-light" },
  Medium: { dot: "bg-amber-400" },
  Low:    { dot: "bg-emerald-400" },
};
```

Badges use only a colored dot + text on glass background — no solid color fills.

### 3.4 Badge Design

```tsx
<span className="
  inline-flex items-center gap-1.5 
  px-3 py-1.5 rounded-full text-xs font-medium
  bg-white/[0.10] backdrop-blur-xl
  border border-white/[0.20]
  shadow-[0_0_12px_rgba(255,255,255,0.04)]
  text-offwhite
">
  <Dot className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
  Approved
</span>
```

### 3.5 Tag Design

```tsx
<span className="
  inline-flex items-center gap-1
  px-2.5 py-1 rounded-full text-[11px] font-medium
  bg-white/[0.08] backdrop-blur-md
  border border-white/[0.18]
  text-slate-body/80
  shadow-[0_0_8px_rgba(255,255,255,0.03)]
">
  <Icon className="h-2.5 w-2.5 opacity-70" />
  Label
</span>
```

---

## 4. Migration Plan (Page by Page)

### 4.1 `/explore` — `LocationCard`

```tsx
import { Globe, MapPin, Building2, FileText } from "lucide-react";

// Container: CSS columns masonry
<div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
  {locations.map((location) => (
    <div key={location._id} className="break-inside-avoid mb-5">
      <LocationCard ... />
    </div>
  ))}
</div>

// Card composition
<GlassCard href={href}>
  <GlassCardMedia imageUrl={photoUrl} fallback="grid" height="lg">
    <GlassCardBadge position="top-start" variant="custom">
      <span className="flex items-center gap-1.5">
        <Globe className="h-3 w-3" />
        {typeLabel}
      </span>
    </GlassCardBadge>
    {location.country && (
      <GlassCardBadge position="top-end" variant="custom" color="text-gold">
        <span className="flex items-center gap-1.5">
          <Globe className="h-3 w-3" />
          {location.country.name}
        </span>
      </GlassCardBadge>
    )}
    <GlassCardTitleOverlay className="p-5">
      <h3 className="text-2xl font-bold text-offwhite">{location.name}</h3>
      <p className="text-sm text-slate-body/80">{location.english_name}</p>
    </GlassCardTitleOverlay>
  </GlassCardMedia>

  <GlassCardContent className="p-5">
    <GlassCardDescription text={plainWars} lines={2} />
    <GlassCardTags tags={[
      { name: "3 Provinces", icon: <MapPin className="h-2.5 w-2.5" /> },
      { name: "5 Reports", color: "#f87171", icon: <FileText className="h-2.5 w-2.5" /> },
    ]} />
    <GlassCardFooter className="mt-4">
      <div />
      <GlassCardCta text={translations.viewDetails} />
    </GlassCardFooter>
  </GlassCardContent>
</GlassCard>
```

### 4.2 `/war-crimes` — `ReportCard`

Same pattern. Use status/priority variants for badges:
```tsx
<GlassCardBadge position="top-start" variant="status" value="Approved" />
<GlassCardBadge position="top-end" variant="priority" value="High" />
```

### 4.3 `/documents` — `DocumentCard`

Use `fallback="icon"` with `FileText` icon when no preview image.

### 4.4 `/reporters` — `ReporterCard`

Horizontal layout with `GlassCardAvatar` (circular, with verified dot).

### 4.5 `/war-criminals` — `WarCriminalCard`

Horizontal layout. Use `GlassCardTags` for status + affiliation.

### 4.6 `/blog` — Blog Article Card

Simpler card, no badges in media area.

---

## 5. Critical Rules

1. **No `bg-white/[0.02]`.** It is invisible. Minimum `bg-white/[0.03] backdrop-blur-xl`.
2. **Use CSS Columns masonry.** Never `grid-cols-N` for cards with varying content heights.
3. **Always wrap cards in `break-inside-avoid`.** Prevents cards from splitting across masonry columns.
4. **Named exports only.** Do NOT use `Object.assign` for compound components — Turbopack breaks.
5. **Badges are glass pills.** `bg-white/[0.10] backdrop-blur-xl border border-white/[0.20] rounded-full`.
6. **Tags are smaller glass pills.** Same style, smaller padding, optional icon.
7. **Media/content separator.** `border-b border-white/[0.08]` on media area.
8. **Icon on every badge/tag.** Every visual label gets a tiny Lucide icon.
9. **No solid color fills.** Status/priority use colored dots, not solid backgrounds.
10. **RTL-safe.** Use logical properties (`me`, `ms`, `start`, `end`).

---

## 6. Acceptance Criteria

- [ ] `src/components/ui/glass-card.tsx` exists with named exports.
- [ ] `/fa/explore` uses CSS Columns masonry with `break-inside-avoid`.
- [ ] Card glass is visible: `bg-white/[0.03] backdrop-blur-xl border border-white/[0.15]`.
- [ ] Badges are beautiful pill shapes with icons, not solid rectangles.
- [ ] Tags are small pill shapes with optional icons.
- [ ] Media area has bottom border separator.
- [ ] TypeScript compiles clean (`pnpm tsc --noEmit`).

---

*End of prompt.*
