# Ziwound New Theme — Design & Style Explanation

**Inspiration Source**:  
[https://dribbble.com/shots/25940621-Crypto-landing-page](https://dribbble.com/shots/25940621-Crypto-landing-page)

## Overall Direction
We are adapting a **premium, ultra-modern dark design** (originally crypto-themed) into a **solemn, respectful, and emotionally powerful** aesthetic suitable for a war crimes documentation and human rights platform.

The new theme keeps the sleek, high-end feel of the inspiration (deep blacks, dramatic lighting, bold typography, glassmorphism, smooth animations) but replaces flashy crypto elements with gravity, respect, and a sense of justice and remembrance.

### Core Design Principles
- **Mood**: Solemn, authoritative, trustworthy, emotionally impactful, memorial-like.
- **Tone**: Serious and respectful — never flashy or commercial.
- **Color Palette**:
  - **Background**: Deep charcoal / near-black (`#0a0a0a` or `#020617`)
  - **Primary Accent**: Crimson / Blood Red (`#991b1b` or `#b91c1c`) — represents justice and urgency
  - **Secondary Accent**: Subtle warm gold / amber (`#d4af37` or `#fbbf24`) — represents hope and remembrance
  - **Text**: Off-white (`#f1f5f9`) for headings, softer gray (`#cbd5e1`) for body
  - **Cards / Surfaces**: Dark glassmorphism (`bg-black/70` + backdrop blur)

- **Typography**:
  - Headings: Bold, large, condensed sans-serif (e.g. Inter Bold or similar to inspiration)
  - Body: Clean, highly readable sans-serif
  - Strong contrast and generous line height for readability

- **Hero Slider (Main Focus)**:
  - Fullscreen (100vh)
  - Deep, cinematic backgrounds with subtle dark overlays
  - Powerful short headlines + emotional taglines
  - Strong CTAs ("Submit Report", "Explore Documented Crimes", "Watch Timeline")
  - Smooth transitions, parallax or slow zoom effects
  - Auto-play with pause on hover

### Visual Style Elements (Adapted from Inspiration)
- Heavy use of **deep dark space** with subtle gradients
- **Glassmorphism** cards and navigation
- Bold, oversized typography with strong hierarchy
- Subtle hover animations and micro-interactions
- High-quality archival or symbolic imagery (war-torn areas, symbolic justice visuals, maps, timelines)
- Clean, minimal layout with plenty of negative space
- Smooth scroll animations and section reveals

### Why This Style Fits Ziwound
- The premium dark aesthetic gives a modern, professional, and trustworthy impression (essential for human rights work).
- Crimson red creates emotional weight and urgency without being sensationalist.
- Fullscreen hero slider becomes the emotional heart of the site — immediately conveying the gravity of the content.
- The style supports rich data visualization (maps, stats, timelines) while remaining elegant.
- Perfectly compatible with existing multi-language + RTL requirements.

### Backend Future Plan
We will later add a `HeroSlide` model so administrators can manage the fullscreen slider content directly from the backend (images, titles, descriptions, CTAs).