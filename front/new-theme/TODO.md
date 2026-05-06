# Ziwound New Theme Redesign — Comprehensive Roadmap

**Goal**: Redesign the entire Ziwound frontend to match a premium, solemn dark aesthetic inspired by https://dribbble.com/shots/25940621-Crypto-landing-page, adapted for a war crimes documentation platform.

**Theme Reference**: See [THEME.md](./THEME.md) for full design explanation, color palette, and adaptation guidelines.

**Pictures Reference**: See `pictures/` folder (00.png, 01.png, 02.png) for visual moodboard.

---

## Global Rules (apply to every phase)

- [ ] **Multi-language first**: Every piece of UI text MUST use `next-intl` translations. Never hardcode English strings in components.
- [ ] **RTL-first testing**: Test every page in Persian (`fa`) and Arabic (`ar`) immediately after implementation.
- [ ] **One page at a time**: Complete one page fully (layout + translations + responsive + RTL) before moving to the next.
- [ ] **Dark mode default**: The new theme is dark-first. Light mode is secondary.
- [ ] **Accessibility**: WCAG AA minimum — focus rings, ARIA labels, semantic HTML, keyboard navigation.
- [ ] **shadcn/ui foundation**: All components built on shadcn/ui primitives. No heavy new libraries.
- [ ] **Server Components by default**: Use Server Components for data fetching; Client Components only for interactivity.
- [ ] **Always read CONTINUE.md first** before starting work.

---

## Phase 1: Global Theme Foundation (COMPLETE)

- [x] Update `globals.css` with premium dark palette (deep blacks, crimson accents, gold highlights).
- [x] Update shadcn/ui theme variables and CSS custom properties.
- [x] Add glassmorphism utilities (`.glass`, `.glass-strong`, `.glass-light`).
- [x] Add glow effects (`.glow-crimson`, `.glow-gold`, `.text-glow-*`).
- [x] Add gradient overlays (`.gradient-overlay`, `.gradient-radial-hero`).
- [x] Add animation keyframes and utility classes (fade-in-up, scale-in, slow-zoom, pulse-glow).
- [x] Update `layout.tsx` to default dark theme, update metadata for Ziwound.
- [x] Update `components.json` base color if needed.
- [x] Add custom scrollbar, selection colors, and smooth scroll.

## Phase 2: Global Layout Components

- [x] **Header** — transparent → solid on scroll, modern dark style, crimson Shield logo.
- [ ] Header translations audit — ensure all nav labels use `t()` not hardcoded strings.
- [x] **Footer** — dark premium theme, gradient accents, newsletter signup restyled.
- [ ] Footer translations audit — ensure all link labels use `t()` not hardcoded strings.
- [x] **Language Switcher** — restyled for dark theme.
- [x] **Breadcrumbs** — ensure dark theme compatibility.
- [ ] **Cookie Consent** — restyle for dark theme.
- [ ] **Error Boundaries** (`error.tsx`, `global-error.tsx`) — dark theme styling.
- [ ] **Loading States** (`loading.tsx`) — dark skeleton loaders.
- [x] **Button variants** — add `crimson`, `gold`, `glass` variants to shadcn Button.

## Phase 3: Landing Page (`/[locale]/`) (MOSTLY COMPLETE)

- [x] **HeroSlider** — fullscreen 100vh, gradient backgrounds, auto-play, RTL arrows/dots.
- [x] **ImpactStats** — live backend counters, animated numbers.
- [x] **FeaturedReports** — real data from backend, glass cards, hover effects.
- [x] **MapTeaser** — stylized world map with pulse hotspots.
- [x] **Timeline** — vertical timeline of recent events.
- [x] **TrustMission** — mission statement + 4 pillars.
- [x] **SubmitCTA** — dramatic crimson-glow call to action.
- [x] Connect to backend APIs (report count, document count, recent reports/blog posts).
- [x] Add SEO `generateMetadata`.
- [x] **CRITICAL**: Fix all hardcoded English strings in landing components. Every string now comes from `messages/*.json` via props.
- [x] Translate all new `home.*` keys into Persian (fa).
- [ ] Translate all new `home.*` keys into the other 8 languages (ar, zh, pt, es, nl, tr, ru).
- [ ] Test landing page fully in Persian (RTL) — text direction, slider arrows, card layouts.

## Phase 4: Auth Pages

- [ ] **Login Page** (`/[locale]/login`) — dark theme, glass card, crimson accents.
- [ ] **Register Page** (`/[locale]/register`) — dark theme, multi-step if needed.
- [ ] Auth form translations audit — all labels, placeholders, errors, buttons.
- [ ] Auth page SEO metadata.
- [ ] Test auth pages in RTL.

## Phase 5: Report Pages

- [ ] **New Report Page** (`/[locale]/reports/new`) — dark theme, glass form sections.
- [ ] **My Reports Page** (`/[locale]/reports/my`) — dark table/cards, status badges restyled.
- [ ] **Report Detail Page** (`/[locale]/reports/[id]`) — dark layout, document previews.
- [ ] Report form translations audit.
- [ ] Report status/priority badge colors updated for dark theme.
- [ ] Test all report pages in RTL.

## Phase 6: War Crimes Exploration Page

- [ ] **War Crimes Page** (`/[locale]/war-crimes`) — dark theme for map, filters, lists.
- [ ] Map styling — dark map tiles or custom dark map overlay.
- [ ] Filter panel — glassmorphism dark style.
- [ ] Statistics/charts — dark theme colors (crimson/gold palette).
- [ ] Timeline view — dark styling.
- [ ] Export/share buttons — new button variants.
- [ ] Translations audit for all war-crimes UI strings.
- [ ] Test in RTL.

## Phase 7: Blog Pages

- [ ] **Blog Listing** (`/[locale]/blog`) — dark cards, search/filter restyled.
- [ ] **Blog Post Detail** (`/[locale]/blog/[slug]`) — dark article layout, typography.
- [ ] Rich text renderer — dark theme compatible (code blocks, quotes, links).
- [ ] Blog translations audit.
- [ ] Test in RTL.

## Phase 8: Static Content Pages

- [ ] **About Page** (`/[locale]/about`) — dark theme, glass sections.
- [ ] **Contact Page** (`/[locale]/contact`) — dark form, glass cards.
- [ ] **FAQ Page** (`/[locale]/faq`) — dark accordion, search bar.
- [ ] **Privacy Policy** (`/[locale]/privacy`) — dark typography layout.
- [ ] **Terms of Service** (`/[locale]/terms`) — dark typography layout.
- [ ] **Help Page** (`/[locale]/help`) — dark sections.
- [ ] All static page translations audit.
- [ ] Test all in RTL.

## Phase 9: Admin Panel (`/admin/*`)

- [ ] **Admin Dashboard** (`/admin/dashboard`) — dark charts, dark stat cards.
- [ ] **Admin Reports** (`/admin/reports`) — dark data table, dark filters.
- [ ] **Admin Users** (`/admin/users`) — dark table, dark modals.
- [ ] **Admin Tags** (`/admin/tags`) — dark cards/forms.
- [ ] **Admin Categories** (`/admin/categories`) — dark cards/forms.
- [ ] **Admin Documents** (`/admin/documents`) — dark table, dark upload UI.
- [ ] **Admin Blog** (`/admin/blog`) — dark editor, dark list.
- [ ] **Admin Files** (`/admin/files`) — dark grid/table.
- [ ] **Admin Countries/Provinces/Cities** — dark forms with RTE.
- [ ] Admin sidebar restyled for dark theme.
- [ ] Admin translations audit.

## Phase 10: Multi-language Completion

- [ ] Audit EVERY component for hardcoded English strings.
- [ ] Add missing translation keys to `messages/en.json` (source of truth).
- [ ] Translate all new keys to `messages/fa.json` (Persian, RTL, default).
- [ ] Translate all new keys to `messages/ar.json` (Arabic, RTL).
- [ ] Translate all new keys to `messages/zh.json` (Chinese).
- [ ] Translate all new keys to `messages/pt.json` (Portuguese).
- [ ] Translate all new keys to `messages/es.json` (Spanish).
- [ ] Translate all new keys to `messages/nl.json` (Dutch).
- [ ] Translate all new keys to `messages/tr.json` (Turkish).
- [ ] Translate all new keys to `messages/ru.json` (Russian).
- [ ] Run translation key consistency check across all 9 files.
- [ ] Test each language on every page.

## Phase 11: Polish & Optimization

- [ ] Image optimization — replace Unsplash placeholders with real imagery or optimized assets.
- [ ] Lazy load heavy components (HeroSlider images, maps).
- [ ] Add `loading.tsx` to all routes for skeleton states.
- [ ] Add `error.tsx` to all routes for graceful error UI.
- [ ] Performance audit — Lighthouse 90+ scores.
- [ ] Accessibility audit — screen reader testing, keyboard-only navigation.
- [ ] Mobile responsiveness audit — all pages at 320px+.
- [ ] PWA manifest and icons updated for dark theme.
- [ ] Final build verification (`pnpm build` passes with zero errors).

## Phase 12: Backend Integration (Future)

- [ ] Add `HeroSlide` model to backend for dynamic slider content.
- [ ] Connect MapTeaser hotspots to real report coordinates.
- [ ] Add real-time stats to ImpactStats if backend supports it.

---

**Current Phase**: Phase 3 — Landing Page (fixing hardcoded translations, then testing RTL).

**Next Immediate Step**: Fix all hardcoded English strings in landing components and add proper translations to all 9 language files.
