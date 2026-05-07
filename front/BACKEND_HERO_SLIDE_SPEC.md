# Backend Specification: HeroSlide Model

> This document describes the backend model and API actions needed to support the dynamic `HeroSlider` component on the Ziwound landing page.
>
> **Frontend consumer**: `src/components/landing/HeroSlider.tsx`  
> **Current phase**: Phase 12 — Backend Integration (Future)

---

## 1. Model Definition (`heroSlide`)

Define a new Lesan model called `heroSlide` with the following fields.

### Pure Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `title` | `string` | ✅ | — | Main heading text (max 200 chars) |
| `subtitle` | `string` | ✅ | — | Description paragraph (max 500 chars) |
| `gradient` | `string` | ❌ | `null` | CSS gradient string. Used when no image is uploaded. Example: `radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%)` |
| `ctaText` | `string` | ✅ | — | Primary button label (e.g. `"Submit Report"`) |
| `ctaLink` | `string` | ✅ | — | Primary button URL path (e.g. `/reports/new`) |
| `secondaryCtaText` | `string` | ❌ | `null` | Secondary button label |
| `secondaryCtaLink` | `string` | ❌ | `null` | Secondary button URL path |
| `order` | `number` | ✅ | `0` | Sort order for the slides (0 = first) |
| `isActive` | `boolean` | ✅ | `true` | Only active slides appear on the site |
| `createdAt` | `Date` | ✅ | `now` | Auto-generated |
| `updatedAt` | `Date` | ✅ | `now` | Auto-generated |

### Relations

| Relation | Model | Type | Optional | Notes |
|----------|-------|------|----------|-------|
| `image` | `file` | single | ✅ | Background image. If present, `gradient` is ignored by the frontend. |

---

## 2. Lesan Model Schema (Backend Code)

```typescript
// backend/src/models/heroSlide.ts

export const heroSlidePure = {
  title: string(),
  subtitle: string(),
  gradient: string(),
  ctaText: string(),
  ctaLink: string(),
  secondaryCtaText: string(),
  secondaryCtaLink: string(),
  order: number(),
  isActive: boolean(),
};

export const heroSlideRelations = {
  image: {
    schema: fileSchema,
    type: "single",
    optional: true,
  },
};
```

---

## 3. Required API Actions

Implement the following Lesan acts for the `heroSlide` model.

### `heroSlide/gets` — Public
Fetch all active slides for the landing page.

**Access**: Public (no authentication required).

**Request `set` parameters**:
| Param | Type | Required | Default |
|-------|------|----------|---------|
| `isActive` | `boolean` | ❌ | `true` |
| `page` | `number` | ❌ | `1` |
| `limit` | `number` | ❌ | `20` |
| `sortBy` | `string` | ❌ | `"order"` |
| `sortOrder` | `"asc" \| "desc"` | ❌ | `"asc"` |

**Request `get` selection**:
```json
{
  "_id": 1,
  "title": 1,
  "subtitle": 1,
  "gradient": 1,
  "ctaText": 1,
  "ctaLink": 1,
  "secondaryCtaText": 1,
  "secondaryCtaLink": 1,
  "order": 1,
  "isActive": 1,
  "image": { "name": 1, "mimeType": 1, "type": 1 }
}
```

**Response body**:
```json
[
  {
    "_id": "abc123",
    "title": "Documenting War Crimes",
    "subtitle": "A global platform for documenting human rights violations...",
    "gradient": "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%)",
    "ctaText": "Submit Report",
    "ctaLink": "/reports/new",
    "secondaryCtaText": "Explore Map",
    "secondaryCtaLink": "/war-crimes",
    "order": 0,
    "isActive": true,
    "image": {
      "_id": "img456",
      "name": "hero-bg-1.jpg",
      "mimeType": "image/jpeg",
      "type": "image"
    }
  }
]
```

---

### `heroSlide/get` — Admin Only
Fetch a single slide by ID.

**Access**: Admin (`Ghost`, `Manager`, `Editor`).

---

### `heroSlide/add` — Admin Only
Create a new hero slide.

**Access**: Admin only.

**Request body**:
```json
{
  "title": "New Slide Title",
  "subtitle": "Description text...",
  "gradient": "linear-gradient(to bottom, #0a0a0a, #1a0505)",
  "ctaText": "Read More",
  "ctaLink": "/blog",
  "secondaryCtaText": null,
  "secondaryCtaLink": null,
  "order": 2,
  "isActive": true,
  "image": "fileId123"
}
```

---

### `heroSlide/update` — Admin Only
Update an existing slide.

**Access**: Admin only.

---

### `heroSlide/remove` — Admin Only
Delete a slide by ID.

**Access**: Admin only.

---

## 4. Frontend Integration Plan

Once the backend model and actions exist, the auto-generated `src/types/declarations.ts` will include the `heroSlideSchema` type.

### Step 1: Create server action
Create `src/app/actions/heroSlide/gets.ts`:

```typescript
"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const gets = async (
  data: ReqType["main"]["heroSlide"]["gets"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["heroSlide"]["gets"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "heroSlide",
      act: "gets",
      details: {
        set: data,
        get: getSelection || {},
      },
    });

    return result;
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
```

### Step 2: Update landing page
In `src/app/[locale]/page.tsx`, replace the hardcoded `heroSlides` array with a backend fetch:

```typescript
import { gets as getHeroSlides } from "@/app/actions/heroSlide/gets";

// Inside the Home component:
const slidesRes = await getHeroSlides(
  { isActive: true, limit: 10 },
  {
    _id: 1,
    title: 1,
    subtitle: 1,
    gradient: 1,
    ctaText: 1,
    ctaLink: 1,
    secondaryCtaText: 1,
    secondaryCtaLink: 1,
    order: 1,
    image: { name: 1, mimeType: 1, type: 1 },
  }
);

const heroSlides: HeroSlide[] = slidesRes?.success && Array.isArray(slidesRes.body)
  ? slidesRes.body.map((s: any) => ({
      id: s._id,
      image: s.image ? getImageUploadUrl(s.image.name) : undefined,
      gradient: s.gradient || undefined,
      title: s.title,
      subtitle: s.subtitle,
      ctaText: s.ctaText,
      ctaLink: s.ctaLink,
      secondaryCtaText: s.secondaryCtaText || undefined,
      secondaryCtaLink: s.secondaryCtaLink || undefined,
    })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  : [];

// If no slides returned, fallback to a single default slide
if (heroSlides.length === 0) {
  heroSlides.push({
    id: "default",
    gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%)",
    title: t("hero.slide1.title"),
    subtitle: t("hero.slide1.subtitle"),
    ctaText: t("hero.slide1.cta"),
    ctaLink: `/${locale}/reports/new`,
  });
}
```

### Step 3: Add admin panel page
Create `/admin/hero-slides` with:
- Data table listing all slides (title, order, isActive, image thumbnail)
- Sortable rows (drag-to-reorder or number inputs)
- Add/Edit form with fields matching the model above
- Image upload using the existing `FileUploadField` component
- Gradient preview box showing the entered CSS
- Publish/unpublish toggle (`isActive`)

---

## 5. Seed Data (First Deploy)

To prevent an empty landing page on first deploy, seed these 3 slides:

```json
[
  {
    "title": "Documenting War Crimes",
    "subtitle": "A global platform for documenting human rights violations and war crimes with verified evidence.",
    "gradient": "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
    "ctaText": "Submit Report",
    "ctaLink": "/reports/new",
    "secondaryCtaText": "Explore Map",
    "secondaryCtaLink": "/war-crimes",
    "order": 0,
    "isActive": true
  },
  {
    "title": "Verified Evidence Matters",
    "subtitle": "Every report is carefully reviewed by our team to ensure accuracy and accountability.",
    "gradient": "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(212,175,55,0.12) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
    "ctaText": "Learn More",
    "ctaLink": "/about",
    "order": 1,
    "isActive": true
  },
  {
    "title": "Stories That Must Be Told",
    "subtitle": "Read witness testimonies, survivor accounts, and investigative reports from conflict zones.",
    "gradient": "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.15) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0a0a0a, #0f0f0f)",
    "ctaText": "Read Stories",
    "ctaLink": "/blog",
    "secondaryCtaText": "Submit Report",
    "secondaryCtaLink": "/reports/new",
    "order": 2,
    "isActive": true
  }
]
```

---

## 6. Notes for Backend Developer

1. **Public access**: The `heroSlide/gets` action **must** be callable without authentication so the landing page works for anonymous visitors. Configure the Lesan act permissions accordingly.

2. **Image handling**: If `image` is uploaded, store the file relation ID. The frontend will construct the image URL using `getImageUploadUrl(image.name)`.

3. **Gradient vs Image**: The frontend checks `slide.image` first. If an image exists, it uses the image. If not, it falls back to `slide.gradient`. If neither exists, it uses a default dark gradient.

4. **Order field**: The frontend does not sort slides itself — it expects the backend to return them in the correct `order`. Ensure the `gets` act sorts by `order` ascending by default.

5. **Regenerate types**: After adding the model and acts, regenerate the TypeScript declarations and copy the updated `declarations.ts` to the frontend at `src/types/declarations.ts`.

---

## Related Files

| File | Role |
|------|------|
| `src/components/landing/HeroSlider.tsx` | The slider component that consumes this data |
| `src/app/[locale]/page.tsx` | Landing page — needs to fetch hero slides |
| `src/components/landing/hero-slider-dynamic.tsx` | Client wrapper for dynamic import |
| `new-theme/TODO.md` | Project roadmap |
| `new-theme/CONTINUE.md` | Current phase tracking |
