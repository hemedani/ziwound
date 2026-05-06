# CONTINUE — Ziwound New Theme Redesign

**Theme Reference**: Follow the detailed guidelines in [THEME.md](./THEME.md). Always maintain the solemn and respectful tone while using the premium dark style from the crypto landing page inspiration.

**Pictures Reference**: Reference images in `pictures/` folder (00.png, 01.png, 02.png).

**Project Context**: This redesign touches the entire Ziwound frontend. Read `../AGENT.md` for complete architecture, conventions, and tech stack. Read `../TODO.md` and `../CONTINUE.md` for the main project roadmap.

---

## Current Focus

You are implementing the new sleek dark theme (deep blacks `#0a0a0a`, crimson `#991b1b`, gold `#d4af37`) across **all pages** of the Ziwound frontend. This is not just a landing page redesign — it is a complete visual overhaul of every public page, auth page, report page, blog page, war crimes page, static page, and admin panel.

## Key Rules (non-negotiable)

1. **Multi-language FIRST**: Every string visible to the user MUST come from `next-intl` translation files (`messages/*.json`). Never hardcode English text. If a key doesn't exist, create it in ALL 9 language files.
2. **RTL-first mentality**: Persian (`fa`) is the default locale and RTL. Test every change in `fa` before considering it done. Use logical CSS properties (`start`, `end`, `ps`, `pe`) not physical (`left`, `right`, `pl`, `pr`).
3. **One page at a time**: Complete redesign + translations + RTL test for one page before moving to the next. Do NOT skip around.
4. **Dark mode default**: The new theme assumes dark mode. Light mode support is secondary.
5. **Solemn tone**: No flashy crypto elements. Deep, respectful, authoritative. Crimson represents justice and urgency; gold represents hope and remembrance.
6. **shadcn/ui + Tailwind only**: Do not introduce heavy libraries. Use existing shadcn primitives.
7. **Server Components by default**: Fetch data in Server Components. Use Client Components only for interactivity (sliders, forms, animations).
8. **Work from TODO.md**: Check `new-theme/TODO.md` for the exact current phase and next unchecked item.

## Design System Quick Reference

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Card | `#0f0f0f` | Card/container surfaces |
| Crimson | `#991b1b` | Primary accent, CTAs, badges |
| Crimson Light | `#b91c1c` | Hover states |
| Gold | `#d4af37` | Secondary accent, icons, highlights |
| Off-white | `#f1f5f9` | Headings |
| Slate Body | `#cbd5e1` | Body text |
| Border | `rgba(255,255,255,0.06)` | Subtle borders |

### Utilities Available in globals.css
- `.glass` — light glassmorphism card
- `.glass-strong` — heavy glassmorphism (for menus/overlays)
- `.glass-light` — subtle glassmorphism (for cards)
- `.glow-crimson` — crimson box-shadow glow
- `.glow-gold` — gold box-shadow glow
- `.text-glow-crimson` — crimson text shadow
- `.gradient-overlay` — bottom-to-top dark gradient
- `.gradient-radial-hero` — subtle crimson radial glow
- `.animate-fade-in-up` — entrance animation
- `.animate-pulse-glow` — pulsing crimson glow

### Button Variants
- `variant="crimson"` — primary action button
- `variant="gold"` — secondary/highlight button
- `variant="glass"` — subtle action on dark backgrounds

## Translation Workflow

When adding ANY new UI text:

1. Add the key to `messages/en.json` (English is the source of truth).
2. Add the same key to `messages/fa.json` with Persian translation.
3. Add the same key to the other 7 language files with at least a placeholder (English is acceptable as fallback).
4. Use `const t = useTranslations("namespace")` in Client Components or `const t = await getTranslations({ locale, namespace: "namespace" })` in Server Components.
5. Never use raw strings like `"Submit Report"` — always use `t("submitCTA.primary")`.

## RTL Testing Checklist

For every page you redesign, verify in Persian (`/fa/`):
- [ ] Text direction is RTL
- [ ] Slider arrows point the right way
- [ ] Card layouts don't break
- [ ] Navigation dropdowns align correctly
- [ ] Form labels align right
- [ ] Tables scroll horizontally if needed
- [ ] Timeline alternating layout works
- [ ] Map markers/tooltips position correctly

## What's Done So Far

- ✅ Phase 1: Global theme foundation (globals.css, layout.tsx, button variants)
- ✅ Phase 2: Header, Footer, LanguageSwitcher restyled
- ✅ Phase 3 (partial): Landing page sections built (HeroSlider, ImpactStats, FeaturedReports, MapTeaser, Timeline, TrustMission, SubmitCTA)
- ✅ Backend integration: ImpactStats fetches live counts, FeaturedReports fetches real data
- ✅ SEO metadata added to landing page
- ✅ **CRITICAL FIX**: All hardcoded English strings removed from landing components
- ✅ Persian (fa) translations added for all new `home.*` keys

## What's Next (Immediate)

### Step 1: Translate new `home.*` keys to remaining 8 languages

The English source keys exist in all 9 files, but only Persian has proper translations. Update:
- `messages/ar.json` — Arabic translations
- `messages/zh.json` — Chinese translations
- `messages/pt.json` — Portuguese translations
- `messages/es.json` — Spanish translations
- `messages/nl.json` — Dutch translations
- `messages/tr.json` — Turkish translations
- `messages/ru.json` — Russian translations

### Step 2: Proceed page by page through TODO.md

After landing page translations are complete, redesign each page in order:
1. Auth pages (login, register) — dark glass cards, crimson accents
2. Report pages (new, my, detail) — dark form sections, updated badges
3. War crimes page — dark map, dark filters, dark charts
4. Blog pages — dark cards, dark article layout
5. Static pages (about, contact, faq, privacy, terms, help) — dark sections
6. Admin panel pages — dark tables, dark modals, dark sidebar

## How to Proceed

1. Read `new-theme/TODO.md` to find the current unchecked item.
2. Implement ONE item completely.
3. Run `pnpm build` to verify no TypeScript errors.
4. Check for hardcoded strings — fix any you find.
5. Test in Persian (`/fa/`) for RTL correctness.
6. Mark the item `[x]` in TODO.md.
7. Report to the user what was changed and ask for review.

## Performance Notes

- HeroSlider uses CSS gradients, not heavy images (good for performance).
- Framer Motion is already installed — use it for scroll-triggered animations.
- Lazy load the WarCrimesMap with `next/dynamic` (already done).
- Use `next/image` for all images with proper `sizes` and `unoptimized` for proxied images.

## Accessibility Notes

- All interactive elements must have `focus-visible:ring-2 focus-visible:ring-crimson`.
- Icon-only buttons need `aria-label`.
- Color contrast: crimson on black passes WCAG AA for large text; gold on black passes for normal text.
- Prefer `aria-live="polite"` for dynamic content updates.

---

**Remember**: This redesign is about dignity and respect for victims. Every pixel should feel serious, trustworthy, and powerful. Never flashy. Always solemn.
