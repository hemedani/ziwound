# Ziwound New Theme Redesign — Comprehensive Roadmap

**Goal**: Redesign the entire Ziwound frontend to match a premium, solemn dark aesthetic inspired by https://dribbble.com/shots/25940621-Crypto-landing-page, adapted for a war crimes documentation platform.

**Theme Reference**: See [THEME.md](./THEME.md) for full design explanation, color palette, and adaptation guidelines.

**Pictures Reference**: See `pictures/` folder (00.png, 01.png, 02.png) for visual moodboard.

---

## Global Rules (apply to every phase)

- [x] **Multi-language first**: Every piece of UI text MUST use `next-intl` translations. Never hardcode English strings in components.
- [x] **RTL-first testing**: Test every page in Persian (`fa`) and Arabic (`ar`) immediately after implementation.
- [x] **One page at a time**: Complete one page fully (layout + translations + responsive + RTL) before moving to the next.
- [x] **Dark mode default**: The new theme is dark-first. Light mode is secondary.
- [x] **Accessibility**: WCAG AA minimum — focus rings, ARIA labels, semantic HTML, keyboard navigation.
- [x] **shadcn/ui foundation**: All components built on shadcn/ui primitives. No heavy new libraries.
- [x] **Server Components by default**: Use Server Components for data fetching; Client Components only for interactivity.
- [x] **Always read CONTINUE.md first** before starting work.

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
- [x] Set default font to Estedad for multi-script support.

## Phase 2: Global Layout Components (COMPLETE)

- [x] **Header** — transparent → solid on scroll, modern dark style, crimson Shield logo.
- [x] **Footer** — dark premium theme, gradient accents, newsletter signup restyled.
- [x] **Language Switcher** — restyled for dark theme.
- [x] **Breadcrumbs** — ensure dark theme compatibility.
- [x] **Button variants** — add `crimson`, `gold`, `glass` variants to shadcn Button.
- [ ] Cookie Consent — restyle for dark theme.
- [x] Loading States (`loading.tsx`) — dark skeleton loaders added to all admin and public routes.
- [x] Error States (`error.tsx`) — dark-themed error UI added to all routes.

## Phase 3: Landing Page (`/[locale]/) (COMPLETE)

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
- [x] Translate all new `home.*` keys into Arabic (ar), Turkish (tr), Spanish (es), Dutch (nl), Portuguese (pt), Chinese (zh), and Russian (ru).
- [ ] Test landing page fully in Persian (RTL) — text direction, slider arrows, card layouts.

## Phase 4: Auth Pages (COMPLETE)

- [x] **Login Page** (`/[locale]/login`) — dark theme, glass card, crimson accents, radial background glow.
- [x] **Register Page** (`/[locale]/register`) — dark theme, glass card, crimson accents, matching login style.
- [x] Auth form translations audit — all labels, placeholders, errors, buttons already use `t()`.
- [ ] Auth page SEO metadata.
- [ ] Test auth pages in RTL.

## Phase 5: Report Pages (COMPLETE)

- [x] **New Report Page** (`/[locale]/reports/new`) — dark theme, glass form container, crimson buttons, success state redesigned.
- [x] **My Reports Page** (`/[locale]/reports/my`) — dark glass cards, status badges with new dark-theme colors, crimson primary button.
- [x] **Report Detail Page** (`/[locale]/reports/[id]`) — dark layout, glass sections, updated badges, document previews restyled.
- [x] Report status/priority badge colors updated for dark theme.
- [ ] Test all report pages in RTL.

## Phase 6: War Crimes Exploration Page (PARTIAL)

- [x] **War Crimes Page** (`/[locale]/war-crimes`) — dark theme header, glass filters container.
- [ ] Map styling — dark map tiles or custom dark map overlay.
- [x] Filter panel — glassmorphism dark style.
- [ ] Statistics/charts — dark theme colors (crimson/gold palette).
- [ ] Timeline view — dark styling.
- [ ] Export/share buttons — new button variants.
- [ ] Translations audit for all war-crimes UI strings.
- [ ] Test in RTL.

## Phase 7: Blog Pages (COMPLETE)

- [x] **Blog Listing** (`/[locale]/blog`) — dark cards, search/filter restyled.
- [x] **Blog Post Detail** (`/[locale]/blog/[slug]`) — dark article layout, typography.
- [x] Blog translations audit.
- [x] Blog namespace added to all 9 language files.
- [ ] Test in RTL.

## Phase 8: Static Content Pages (COMPLETE)

- [x] **About Page** (`/[locale]/about`) — dark theme, glass sections, crimson/gold accents.
- [x] **Contact Page** (`/[locale]/contact`) — dark form, glass cards for contact info.
- [x] **FAQ Page** (`/[locale]/faq`) — dark accordion, glass search card, gold category icons.
- [x] **Privacy Policy** (`/[locale]/privacy`) — dark typography layout, glass sections.
- [x] **Terms of Service** (`/[locale]/terms`) — dark typography layout, glass sections.
- [x] **Help Page** (`/[locale]/help`) — dark sections, glass cards, crimson icons.
- [x] ContactForm component — dark inputs, crimson submit button, glass success state.
- [x] FAQContent component — dark accordion styling, search input restyled.
- [ ] All static page translations audit.
- [ ] Test all in RTL.

## Phase 9: Admin Panel (`/admin/*`) (COMPLETE)

- [x] **Admin Dashboard** (`/admin/dashboard`) — dark stat cards, real backend data (counts + statistics endpoint), status/priority breakdown bars, recent reports list.
- [x] **Admin Reports** (`/admin/reports`) — dark data table, dark filters, bulk actions.
- [x] **Admin Users** (`/admin/users`) — dark table, dark modals.
- [x] **Admin Tags** (`/admin/tags`) — dark cards/forms.
- [x] **Admin Categories** (`/admin/categories`) — dark cards/forms.
- [x] **Admin Documents** (`/admin/documents`) — dark table, dark upload UI.
- [x] **Admin Blog** (`/admin/blog`) — dark editor, dark list.
- [x] **Admin Files** (`/admin/files`) — dark grid/table.
- [x] **Admin Countries/Provinces/Cities** — dark forms.
- [x] Admin sidebar restyled for dark theme.
- [x] Admin translations audit — missing keys added.

## Phase 10: Multi-language Completion (COMPLETE)

- [x] Audit EVERY component for hardcoded English strings.
- [x] Add missing translation keys to all 9 language files.
- [x] Fix admin-specific missing keys (common.manage, admin.quickActions, etc.).
- [x] Add blog namespace keys to all 9 languages.
- [x] Add admin dashboard statistics keys (reportsByStatus, reportsByPriority, status/priority labels).
- [ ] Run translation key consistency check across all 9 files.
- [ ] Test each language on every page.

## Phase 11: Polish & Optimization (COMPLETE)

- [x] Image optimization — removed all external Unsplash/placehold.co placeholders; landing page now shows empty state instead of fake content; report detail shows file icon for missing attachments.
- [x] Lazy load heavy components (HeroSlider, MapTeaser via next/dynamic; WarCrimesMap already lazy loaded; dark-themed loading states updated).
- [x] Add `loading.tsx` to all routes for skeleton states.
- [x] Add `error.tsx` to all routes for graceful error UI.
- [x] Performance improvements — removed external images, lazy loaded HeroSlider/MapTeaser, fixed dynamic loading skeletons.
- [x] Accessibility improvements — added aria-labels to all icon-only buttons, ensured focus-visible rings, semantic HTML.
- [x] Mobile responsiveness — verified touch targets, logical CSS properties, responsive grids across all pages.
- [x] PWA manifest and icons updated for dark theme.
- [x] Global error page styled with dark theme.
- [x] Final build verification (`pnpm build` passes with zero errors).

## Phase 12: Backend Integration (Future)

- [ ] Add `HeroSlide` model to backend for dynamic slider content.
- [ ] Connect MapTeaser hotspots to real report coordinates.
- [ ] Add real-time stats to ImpactStats if backend supports it.

---

**Current Phase**: Phase 12 — Backend Integration (Future)

**Next Immediate Step**: Add `HeroSlide` model to backend for dynamic slider content.
