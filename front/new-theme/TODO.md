# Ziwound New Theme Redesign (Inspired by Crypto Landing Page)

**Goal**: Fully redesign the landing page and core theme to match the sleek, modern, high-impact dark style from https://dribbble.com/shots/25940621-Crypto-landing-page, while adapting it to a solemn human-rights / war-crimes documentation platform.  
Add a powerful fullscreen hero slider at the top.

**Theme Reference**: See [THEME.md](./THEME.md) for full design explanation, color palette, and adaptation guidelines from the Dribbble inspiration.

**Pictures Reference**: See `pictures/` folder (00.png, 01.png, 02.png) for visual moodboard.

## Phase 1: Project Setup & Theme Foundation
- [ ] Create new Tailwind config with updated color palette (deep dark base + crimson/red accents + subtle gold/amber highlights).
- [ ] Update `globals.css` and shadcn/ui theme variables for the new dark premium look.
- [ ] Define typography scale (bold authoritative headings, clean readable body).
- [ ] Add custom CSS for glassmorphism / subtle neon glows / smooth scroll animations matching the inspiration.

## Phase 2: Fullscreen Hero Slider
- [ ] Create `components/landing/HeroSlider.tsx` — fullscreen (100vh), deep impactful background with overlay.
- [ ] Support multiple slides (background images + short powerful text + CTA).
- [ ] Add smooth auto-play + manual navigation (arrows + dots).
- [ ] Make it fully responsive and RTL-friendly.
- [ ] Plan backend model later: `HeroSlide` (image, title, subtitle, ctaText, ctaLink, order).

## Phase 3: Landing Page Sections (in order)
- [ ] Update `app/page.tsx` (or landing route) with new structure.
- [ ] Impact Stats Bar (live counters from backend: reports, countries, documents).
- [ ] Featured Reports / Stories carousel (pull from Report + BlogPost models).
- [ ] Interactive World Map Teaser (report density pins).
- [ ] Timeline / By Country section.
- [ ] Trust & Mission section (solemn tone).
- [ ] Submit Report CTA section.
- [ ] Footer redesign.

## Phase 4: Reusable Components & Polish
- [ ] Navigation bar (transparent → solid on scroll, modern style).
- [ ] Card components with hover effects matching inspiration.
- [ ] Button variants (primary crimson, secondary gold).
- [ ] Dark-mode-first + high contrast accessibility (WCAG).
- [ ] Full RTL testing for all 9 languages.
- [ ] Add subtle particle / background effects if performance allows.

## Phase 5: Optimization & Backend Integration
- [ ] Connect all sections to existing backend APIs (Reports, Documents, etc.).
- [ ] Add `HeroSlide` model to backend (future).
- [ ] Performance: Image optimization, lazy loading, Next.js caching.
- [ ] SEO + meta tags for the new landing.

**Priority Order**: Phase 1 → Hero Slider → Main page structure.