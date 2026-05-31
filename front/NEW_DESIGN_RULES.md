# New Design Rules & Standards

This document defines the standardized page layout, component structure, and visual consistency rules for the ZiWound frontend. Every new public-facing page MUST follow these rules unless explicitly exempted.

---

## 1. Page Layout Standard

### 1.1 PageContainer Component

Every `/[locale]/*` page MUST use the `PageContainer` component from `@/components/layout/page-container` as the outermost wrapper.

```tsx
import { PageContainer } from "@/components/layout/page-container";

export default async function MyPage({ params: { locale } }) {
  return (
    <PageContainer showHeader={false}>
      {/* page content */}
    </PageContainer>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Page content |
| `title` | `string` | — | Centered page title (only when `showHeader=true`) |
| `description` | `string` | — | Subtitle below title |
| `heroGradient` | `string` | `"from-crimson/5"` | Tailwind gradient stop for top radial glow |
| `showHeader` | `boolean` | `true` | Whether to render the centered header block |
| `className` | `string` | `""` | Extra classes on the root `min-h-screen` div |
| `contentClassName` | `string` | centered max-w-7xl padding | Override the content container |

### 1.2 PageContainer Renders

```tsx
<div className="relative min-h-screen bg-background">
  {/* Radial gradient glow — front page's sole background effect */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,from-crimson/5 via-background to-background)]" />
  {/* Mesh grid pattern — 24x24 subtle grid */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
  <div className="relative z-10">
    {showHeader && title && ( centered header block )}
    <div className={contentClassName}>{children}</div>
  </div>
</div>
```

### 1.3 When to Use `showHeader`

| Page Type | `showHeader` | Example Pages |
|-----------|-------------|---------------|
| **Simple static pages** | `true` (with `title` + `description`) | about, faq, privacy, terms, help, contact |
| **Pages with custom hero** | `false` | blog, documents, explore, reporters, war-crimes, war-criminals, all detail pages |
| **Auth pages** | `false` | login, register |
| **Complex multi-step pages** | `false` | reports/new, reports/my |

### 1.4 Exempted Pages

Only these pages do NOT use `PageContainer`:

- **Landing page** (`/[locale]/page.tsx`) — unique full-screen hero slider experience
- **404 catch-all** (`/[...rest]/page.tsx`) — simple `notFound()` call

---

## 2. Background System

### 2.1 Three Layers (Always)

Every `PageContainer`-wrapped page has exactly three visual layers:

1. **Solid background**: `bg-background` (near-black `#0a0a0a`)
2. **Radial glow**: `radial-gradient(ellipse_at_top, rgba(153,27,27,0.05) 0%, transparent 60%)` — subtle crimson glow from top center
3. **Mesh grid**: `linear-gradient` to right and bottom with `#8080800a 1px` lines at 24px intervals — faint grid overlay

**NO page should add its own `min-h-screen` or duplicate these background layers.** Pages with `showHeader={false}` that already have their own hero background gradients are fine — the PageContainer background sits behind.

### 2.2 Directional Radial Overrides

For pages that need a different glow direction (e.g., auth pages centered vertically), the gradient is overridden on the page's own hero div, not on the PageContainer:

```tsx
<PageContainer showHeader={false}>
  <div className="relative overflow-hidden">
    {/* Page-specific glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.12)_0%,_transparent_60%)]" />
    {/* Content */}
  </div>
</PageContainer>
```

---

## 3. Glassmorphism Card System

### 3.1 Available Classes

Three glass variants defined in `globals.css`:

| Class | Background | Blur | Border | Use Case |
|-------|-----------|------|--------|----------|
| `.glass` | `rgba(10,10,10,0.65)` | 16px | `white/0.06` | General purpose cards |
| `.glass-strong` | `rgba(10,10,10,0.85)` | 24px | `white/0.08` | Sidebars, emphasis cards, admin cards |
| `.glass-light` | `rgba(255,255,255,0.03)` | 12px | `white/0.05` | Background sections, hero headers |

### 3.2 Usage Rules

- **Cards that display content**: Use `glass-strong` with `border-white/[0.06]` and `hover:border-white/[0.12]` for subtle lift
- **Section containers**: Use `glass-light` with `border-white/[0.06]` for background grouping
- **Admin page heroes**: Use `glass-light` with inner radial gradient accent
- **Interactive cards**: Always add `transition-colors duration-200` for smooth hover
- **No solid backgrounds**: Never use `bg-card`, `bg-muted`, or solid color classes on public-facing content cards — always glass classes

### 3.3 Card Entry Animation (Grid Views)

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="glass-strong border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-colors duration-200"
>
  {/* card content */}
</motion.div>
```

---

## 4. Typography & Color

### 4.1 Text Hierarchy

| Element | Class | Hex |
|---------|-------|-----|
| Page title (h1) | `text-3xl sm:text-4xl lg:text-5xl font-bold text-offwhite` | `#f1f5f9` |
| Section heading (h2) | `text-xl sm:text-2xl font-bold text-offwhite` | `#f1f5f9` |
| Subheading (h3) | `text-lg font-semibold text-offwhite` | `#f1f5f9` |
| Body text | `text-sm md:text-base text-slate-body` | `#cbd5e1` |
| Muted / secondary | `text-xs sm:text-sm text-slate-body/70` | `#cbd5e1` at 70% |
| Links | `text-crimson hover:text-crimson-light` | `#991b1b` / `#b91c1c` |
| Gold accent | `text-gold hover:text-gold-light` | `#d4af37` / `#fbbf24` |

### 4.2 Color Palette (CSS Variables)

```css
--color-primary:       hsl(0 72% 35%)   /* crimson #991b1b — justice & urgency */
--color-secondary:     hsl(45 80% 52%)  /* gold/amber #d4af37 — hope & remembrance */
--color-crimson:       #991b1b
--color-crimson-light: #b91c1c
--color-crimson-dark:  #7f1d1d
--color-gold:          #d4af37
--color-gold-light:    #fbbf24
--color-offwhite:      #f1f5f9          /* headings */
--color-slate-body:    #cbd5e1          /* body text */
--color-charcoal:      #0a0a0a          /* near-black background */
```

### 4.3 Badge Colors

- **Crimson badges**: `bg-crimson/15 text-crimson border border-crimson/25`
- **Gold badges**: `bg-gold/10 text-gold border border-gold/20`
- **Green badges (success)**: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
- **Gray badges (neutral)**: `bg-white/5 text-slate-body border border-white/10`

---

## 5. Hero Header Pattern (When `showHeader=false`)

Pages with custom heroes follow this consistent structure:

```tsx
<div className="relative overflow-hidden pt-32 pb-12">
  {/* Subtle crimson radial glow */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
  {/* Optional second glow — gold accent */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />
  {/* Underlying page background gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
  <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* hero content */}
  </div>
</div>
```

**Admin page heroes** use a different, more compact pattern:

```tsx
<div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
  <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
  {/* content */}
</div>
```

---

## 6. Spacing & Layout System

- **Page horizontal padding**: `px-4 sm:px-6 lg:px-8` (via `contentClassName`)
- **Page vertical padding**: `py-12 sm:py-16 lg:py-20` (via `contentClassName`)
- **Section spacing**: `space-y-6 md:space-y-8` between sections
- **Card padding**: `p-4 sm:p-6 md:p-8`
- **Grid gap**: `gap-3 md:gap-4 lg:gap-6`
- **Content max-width**: `max-w-7xl mx-auto` for full pages; `max-w-4xl` for focused content
- **Stack min-height**: PageContainer uses `min-h-screen` — no child div should duplicate this
- **Locale layout offset**: The parent locale layout has `pt-16` for the fixed header — `PageContainer` does NOT need to add top padding for the header

---

## 7. RTL / LTR Rules

- **`dir` is set at the `html` tag level** by the root locale layout (based on `locale`). Do NOT set `dir` on `PageContainer` or individual pages.
- **Use logical CSS properties** exclusively: `ps-`/`pe-` (not `pl-`/`pr-`), `ms-`/`me-` (not `ml-`/`mr-`), `start-`/`end-` (not `left-`/`right-`)
- **Directional icons**: Add `rtl:rotate-180` to chevrons, arrows, and other directional icons
- **Test every page in both `fa` (RTL) and `en` (LTR)**

```tsx
// ✅ Correct — directional icon
<ChevronRight className="h-4 w-4 rtl:rotate-180" />

// ❌ Wrong — non-logical property
<ArrowRight className="h-4 w-4 ml-2" />

// ✅ Correct — logical property
<ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
```

---

## 8. Edge Case Handling

### 8.1 Loading State

Use `SkeletonTable` or `SkeletonList` from `@/components/ui/skeleton-states`:

```tsx
import { SkeletonList } from "@/components/ui/skeleton-states";

if (loading) {
  return <PageContainer showHeader={false}><SkeletonList count={6} /></PageContainer>;
}
```

### 8.2 Empty State

Use `EmptyState` from `@/components/ui/empty-state`:

```tsx
import { EmptyState } from "@/components/ui/empty-state";

<EmptyState
  icon={FileText}
  title={t("noReports")}
  description={t("noReportsDescription")}
  action={<Button>{t("createReport")}</Button>}
/>
```

### 8.3 Error State

Use `ErrorState` from `@/components/ui/error-state`:

```tsx
import { ErrorState } from "@/components/ui/error-state";

<ErrorState
  title={t("errorTitle")}
  description={error}
  onRetry={() => setRetryCount(c => c + 1)}
  retryText={t("retry")}
/>
```

**Always wrap edge-case returns in `PageContainer` too**, not just the happy path:

```tsx
if (error) {
  return (
    <PageContainer showHeader={false}>
      <ErrorState title={t("errorTitle")} description={error} onRetry={...} />
    </PageContainer>
  );
}
```

---

## 9. What NOT to Do

| ❌ Don't | ✅ Instead |
|----------|-----------|
| Add `min-h-screen` on a child div | `PageContainer` has it already |
| Add duplicate radial background gradients | Let `PageContainer` provide the background |
| Use `left`/`right` CSS properties | Use `start`/`end` logical properties |
| Use `pl-`/`pr-` Tailwind classes | Use `ps-`/`pe-` logical classes |
| Use `bg-card` or solid backgrounds for content cards | Use `glass-strong` / `glass-light` |
| Use `any` type | Use proper types from `@/types/declarations` |
| Call `t("prefix_")` where prefix can be empty | Guard with existence check first |
| Add `dir` attribute to page-level elements | `dir` is set on `<html>` by locale layout |
| Add top padding for header | Locale layout has `pt-16` already |
| Call `getTranslations()` without `locale` | Always pass `{ locale }` in Server Components |
| Forget to add translation keys to ALL 9 language files | Always update all `/messages/*.json` |

---

## 10. Checklist for New Pages

When creating a new `/[locale]/<page>`:

- [ ] Import `PageContainer` from `@/components/layout/page-container`
- [ ] Wrap the entire return in `<PageContainer showHeader={...}>`
- [ ] Decide `showHeader`: `true` for simple info pages, `false` for complex/custom hero pages
- [ ] Remove any existing `min-h-screen` divs
- [ ] Remove any existing duplicate radial gradient background layers
- [ ] Use glass classes for all content cards
- [ ] Use logical CSS properties throughout (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`)
- [ ] Add `rtl:rotate-180` to directional icons
- [ ] Handle all three edge cases: loading, empty, error states
- [ ] Wrap error/empty/loading returns in `PageContainer` too
- [ ] Pass `locale` explicitly to `getTranslations({ locale })`
- [ ] Add all new translation keys to all 9 language files
- [ ] Run `pnpm exec tsc --noEmit` and fix any new type errors
