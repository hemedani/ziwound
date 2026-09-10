# ZiWound Unified Page Header Standard

> **Version:** 1.1  
> **Scope:** All `/[locale]/*` pages (static and dynamic)  
> **Goal:** A single, beautiful, consistent header pattern shared by every public page.

---

## 1. Philosophy

- **One header to rule them all.** No page invents its own hero.  
- **Full-bleed background, constrained content.** The visual layer spans the viewport; text stays readable.  
- **Glass & blur everywhere.** Every transparent surface uses real `backdrop-blur`, not CSS-variable tricks.  
- **RTL-first.** The reference layout is tested in Persian (`fa`); LTR mirrors it logically.  

---

## 2. Known Layout Gotchas (READ FIRST)

Before applying this standard you must understand two layout constraints that broke every previous attempt:

### 2.1 Fixed Header + `pt-16` Offset

The locale layout (`src/app/[locale]/layout.tsx`) wraps every page in:

```tsx
<div className="min-h-screen flex flex-col pt-16">
```

`pt-16` (`64px`) pushes **all** page content down to clear the fixed `Header` (height `h-16`).  
If you naively render a `<PageHero>` inside this wrapper, the hero background starts `64px` below the top edge of the viewport — leaving an ugly dark gap.

**Fix:** The `<PageHero>` root must include `-mt-16` to pull itself up into that padding space, and the **content** div inside it must add back enough top padding to clear the fixed header (`pt-24` → `pt-32`).

### 2.2 `PageContainer` `max-w-7xl` Trap

`PageContainer` wraps `children` in a div whose default class is:

```
mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20
```

This means **anything** inside `PageContainer` — including `<PageHero>` — is physically constrained to `1280px` width and centred. The `PageHero` can scream `w-full` all day; its absolute background layers are clipped by the parent `max-w-7xl`.

**Fix:** On every page that renders `<PageHero>`, pass `contentClassName=""` to `PageContainer`. The `PageHero` manages its own `max-w-7xl` content box; the rest of the page content must wrap itself in `container mx-auto` or `max-w-7xl` as needed.

### 2.3 Backdrop Blur Needs a Tint

`backdrop-blur` on a **fully transparent** element is invisible when the content behind it is already soft gradients. Previous attempts used `backdrop-blur-[2px]` with no background colour and produced zero visible effect.

**Fix:** Combine blur with an almost-invisible tint so the browser has a surface to render the blur against:

```tsx
<div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm pointer-events-none" />
```

`bg-white/[0.02]` is dark enough to create a frosted-glass panel but light enough that the crimson radial glow still bleeds through beautifully.

### 2.4 Breadcrumbs Must Float Above the Hero

The locale layout renders `<Breadcrumbs />` between the fixed `<Header />` and `<main>`. When `PageHero` uses `-mt-16` to pull itself to the top edge, its absolute background layers paint over the breadcrumbs bar because the breadcrumbs have no explicit stacking context.

**Fix:** Give the breadcrumbs nav `relative z-50` so it stays above the hero background:

```tsx
// src/components/layout/breadcrumbs.tsx
<nav aria-label="Breadcrumb" className="relative z-50 py-4 px-4 md:px-6 border-b bg-muted/30">
```

---

## 3. Anatomy of the Standard Header

```
┌────────────────────────────────────────────────────────────┐
│  FULL-WIDTH BACKGROUND (edge-to-edge)                        │
│  • radial gradient (crimson glow at top)                     │
│  • PageContainer mesh grid behind it                         │
│  • frosted blur overlay                                      │
├────────────────────────────────────────────────────────────┤
│  CONTENT ROW (max-w-7xl, centred)                          │
│  ┌────────┬──────────────────────────────────────────┐     │
│  │ ICON   │  OVERLINE TEXT  (gold, uppercase)         │     │
│  │ (crim) │  ───── small red gradient line ────────   │     │
│  └────────┘                                                  │
│                                                            │
│  TITLE (large, offwhite, text-glow-crimson)                │
│  SUBTITLE (slate-body, max-w-2xl)                          │
│                                                            │
│  ┌─────┐ ┌─────┐ ┌─────┐  ← stat frames row               │
│  │ icn │ │ icn │ │ icn │                                  │
│  │ num │ │ num │ │ num │                                  │
│  │ lbl │ │ lbl │ │ lbl │                                  │
│  └─────┘ └─────┘ └─────┘                                  │
└────────────────────────────────────────────────────────────┘
│  ─── 1px gradient separator (neon pulse) ───               │
```

---

## 4. Background Layer (Full-Width, Blurred)

```tsx
<header className="relative w-full overflow-hidden -mt-16">
  {/* 1. Crimson radial glow */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.12)_0%,_transparent_70%)]" />

  {/* 2. Gold accent glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />

  {/* 3. Frosted blur over the global mesh (PageContainer provides the mesh) */}
  <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm pointer-events-none" />

  {/* ── content starts here ── */}
</header>
```

> **Important:** Do **NOT** duplicate the mesh sweep / shimmer inside `PageHero`. `PageContainer` already renders them once on the entire page. Duplicating them creates muddy visual noise and makes the blur pointless.

---

## 5. Content Area (Centred, Not Full-Width)

```tsx
<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 lg:pb-12">
  {/* everything below lives inside this box */}
</div>
```

- `relative` — lifts content above the absolute background layers.
- `mx-auto max-w-7xl` — prevents text from stretching on ultra-wide monitors.
- `pt-24 → pt-32` — critical top padding so the title never overlaps the fixed header.
- `pb-8 → pb-12` — compact bottom padding; the separator provides the visual break.

---

## 6. Overline (Icon + Label + Red Line)

```tsx
<div className="mb-4 flex items-center gap-3">
  {/* Icon badge */}
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson/10 border border-crimson/20 shadow-lg shadow-crimson/5">
    <Icon className="h-5 w-5 text-crimson" />
  </div>

  {/* Red line */}
  <div className="h-px w-8 bg-gradient-to-r rtl:bg-gradient-to-l from-crimson to-transparent" />

  {/* Gold label */}
  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
    {overline}
  </span>
</div>
```

### RTL behaviour
- In `fa` / `ar` the flex row naturally flips.
- The gradient line must use logical direction: `from-crimson` stays on the **start** side.
- No hardcoded `ml-` / `mr-`; only `gap-*` and logical utilities.

---

## 7. Title & Subtitle

```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite leading-[1.1] tracking-tight text-glow-crimson">
  {title}
</h1>

<p className="text-lg md:text-xl text-slate-body max-w-2xl leading-relaxed mt-3 sm:mt-4">
  {description}
</p>
```

- `text-glow-crimson` — subtle crimson text shadow for depth.
- Subtitle is **NOT** centred with `mx-auto`; it aligns to the same start edge as the title (natural flow).

---

## 8. Stat Frames Row

Every dynamic page **must** expose 3–4 stat frames below the subtitle.
Static pages (about, faq, etc.) can omit them.

```tsx
<div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-4 py-3"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10">
        <stat.icon className="h-4 w-4 text-crimson" />
      </div>
      <div>
        <p className="text-lg font-bold text-offwhite leading-none">{stat.value}</p>
        <p className="text-xs text-slate-body/70 mt-1">{stat.label}</p>
      </div>
    </div>
  ))}
</div>
```

| Property | Value |
|----------|-------|
| Background | `bg-white/[0.03]` |
| Border | `border-white/[0.06]` |
| Blur | `backdrop-blur-md` (real utility, no CSS var) |
| Icon bg | `bg-crimson/10` |
| Value text | `text-offwhite` bold |
| Label text | `text-slate-body/70` |

---

## 9. Neon Separator (Bottom Edge)

```tsx
<div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
  <div
    className="w-full h-px bg-gradient-to-r from-transparent via-crimson/35 to-transparent header-neon-pulse"
    style={{
      animation: "headerNeonPulse 4s ease-in-out infinite",
      boxShadow: "0 0 8px 1px rgba(153,27,27,0.12)",
    }}
  />
</div>
```

CSS (in `globals.css`):

```css
@keyframes headerNeonPulse {
  0%, 100% { opacity: 0.7; box-shadow: 0 0 6px 1px rgba(153,27,27,0.08); }
  50%      { opacity: 1;   box-shadow: 0 0 10px 2px rgba(153,27,27,0.15), 0 0 20px 4px rgba(212,175,55,0.05); }
}

@media (prefers-reduced-motion: reduce) {
  .header-neon-pulse {
    animation: none !important;
    opacity: 0.8 !important;
    box-shadow: none !important;
  }
}
```

---

## 10. Static Pages (`showHeader={true}`)

Pages: `/about`, `/faq`, `/contact`, `/help`, `/privacy`, `/terms`

These pages rely on `PageContainer`'s built-in header.
`PageContainer` renders the **exact same structure** as the dynamic `PageHero`, but without the stat frames row (static pages have no live data).

```tsx
// inside PageContainer.tsx
{showHeader && title && (
  <header className="relative w-full overflow-hidden -mt-16">
    {/* …background layers from §4… */}

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 lg:pb-12">
      {/* overline (optional) */}
      {/* title */}
      {/* description (optional) */}
    </div>

    {/* neon separator */}
  </header>
)}
```

---

## 11. Dynamic Pages (`showHeader={false}` + `<PageHero>`)

Pages: `/blog`, `/war-crimes`, `/reporters`, `/war-criminals`, `/documents`, `/explore`, `/reports/*`, `/login`, `/register`

These pages **do not** use `PageContainer`'s header. They render `<PageHero>` at the top of their own JSX.

**CRITICAL:** You **must** pass `contentClassName=""` to `PageContainer`, otherwise the hero is trapped inside a `max-w-7xl` box and its background can never be full-width.

```tsx
<PageContainer showHeader={false} contentClassName="">
  <PageHero
    icon={<FileText className="h-5 w-5 text-crimson" />}
    overline={t("documents.overline")}
    title={t("documents.title")}
    description={t("documents.description")}
  >
    {/* optional stat frames passed as children */}
    <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">…</div>
  </PageHero>

  {/* rest of page content — must centre itself */}
  <div className="container mx-auto px-4 md:px-8 py-8">…</div>
</PageContainer>
```

`PageHero` exports the **exact same DOM structure** as the `PageContainer` header so that both look identical.

---

## 12. Back Link (Optional)

Used on detail pages (`/reports/[id]`, `/reporters/[id]`, etc.)

```tsx
<PageHero
  backLink={{ href: "/reports/my", label: t("backToReports") }}
  …
/>
```

Renders a small arrow + text above the overline. In RTL the arrow auto-rotates via `rtl:rotate-180`.

---

## 13. Props Interface

```ts
interface PageHeroProps {
  icon?: ReactNode;               // crimson icon inside rounded badge
  overline?: string;              // gold uppercase label
  title: string;                  // large offwhite heading
  description?: string;           // slate-body subtitle
  backLink?: { href: string; label: string };
  children?: ReactNode;           // stat frames, search bars, etc.
  variant?: "default" | "compact"; // compact for auth/dashboard
  className?: string;             // extra root classes
}
```

---

## 14. Do’s and Don’ts

| ✅ Do | ❌ Don’t |
|-------|---------|
| Use `w-full` on the `<header>` or `<PageHero>` root | Constrain the root to `max-w-7xl` |
| Pass `contentClassName=""` to `PageContainer` when using `<PageHero>` | Forget it — the hero background will be clipped to 1280px |
| Add `-mt-16` to the hero root to cancel `pt-16` from the locale layout | Leave a 64px dark gap above the hero |
| Use `pt-24–pt-32` internal padding so the title clears the fixed header | Use `pt-8–pt-12`; text will overlap the header |
| Combine blur with `bg-white/[0.02]` so the frosted glass is visible | Use naked `backdrop-blur-[2px]` on a transparent div — it renders as invisible |
| Let `PageContainer` own the single global mesh sweep/shimmer | Duplicate mesh layers inside every `PageHero` — creates muddy noise |
| Use `gap-*` and logical properties for RTL | Hardcode `ml-` / `mr-` / `text-left` |
| Show stat frames on every dynamic page | Show them on static pages with no data |
| Use `bg-white/[0.03] border-white/[0.06] backdrop-blur-md` for every glass frame | Use `bg-white/5 border-white/10` without blur |
| Respect `prefers-reduced-motion` | Leave animations unguarded |

---

## 15. Visual Reference

The target look is best observed on **`/fa/war-crimes`** after implementation:

1. **Background** — crimson radial glow spans the entire viewport width, mesh grid is softly blurred behind it.
2. **Overline** — icon badge + red line + gold text, aligned to the start edge.
3. **Title** — large, glowing, tightly tracked.
4. **Stats** — 3–4 glass frames with icons, numbers, labels.
5. **Separator** — thin glowing line at the very bottom, edge-to-edge.

If any other page looks different from `/fa/war-crimes`, it is not compliant with this standard.

---

## 16. Troubleshooting

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Dark gap above hero | `pt-16` on locale layout | Add `-mt-16` to `PageHero` root |
| Title overlaps fixed header | Insufficient top padding inside hero | Use `pt-24 sm:pt-28 lg:pt-32` on the content box |
| Hero background clipped at ~1280px | `PageContainer` `contentClassName` has `max-w-7xl` | Pass `contentClassName=""` to `PageContainer` |
| No visible blur effect | Blur layer is transparent with nothing sharp behind it | Add `bg-white/[0.02]` tint to the blur layer |
| Double/triple mesh grid | Both `PageContainer` and `PageHero` render mesh | Remove mesh from `PageHero`; let `PageContainer` own it |
| Neon separator missing | `headerNeonPulse` keyframes not in `globals.css` | Add them per §9 |
| Breadcrumbs hidden under hero | Hero `-mt-16` pulls background over the breadcrumbs bar | Add `relative z-50` to `<nav>` in `breadcrumbs.tsx` |

---

## 17. Files to Touch

| File | Action |
|------|--------|
| `src/components/layout/page-container.tsx` | Update built-in header to match §10 |
| `src/components/layout/page-hero.tsx` | Create/replace with §4–§9 |
| `src/app/globals.css` | Ensure `headerNeonPulse` keyframes exist |
| `src/app/[locale]/blog/page.tsx` | Replace inline header with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/war-crimes/page.tsx` | Replace `<WarCrimesHero>` with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/reporters/page.tsx` | Replace `<ReporterHero>` with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/war-criminals/page.tsx` | Replace inline hero with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/documents/page.tsx` | Replace `<DocumentHero>` with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/explore/page.tsx` | Replace `<ExploreHero>` with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/(dashboard)/reports/new/page.tsx` | Replace inline header with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/(dashboard)/reports/my/page.tsx` | Replace `<MyReportsHeader>` with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/(dashboard)/reports/[id]/page.tsx` | Replace `<ReportHero>` with `<PageHero>`, add `contentClassName=""` |
| `src/app/[locale]/(auth)/login/page.tsx` | Add `<PageHero variant="compact">` or keep card style |
| `src/app/[locale]/(auth)/register/page.tsx` | Add `<PageHero variant="compact">` or keep card style |

---

*End of standard.*
