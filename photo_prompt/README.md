# ZiWound Photo Entry — Hybrid Image Strategy

Each country has its own folder under `photo_prompt/<CODE>/`.
**Each assignee only edits files within their own country folder.**

## Country Assignments

> **All existing photos will be replaced** to enforce a uniform visual style across every country, province, and city.

| Code | Country | Total Entities | Folder |
|------|---------|:--------------:|--------|
| US | United States | 78 (1+18+59) | `photo_prompt/US/` |
| HR | Croatia | 15 (1+7+7) | `photo_prompt/HR/` |
| IR | Iran | 11 (1+5+5) | `photo_prompt/IR/` |
| BA | Bosnia and Herzegovina | 3 (1+1+1) | `photo_prompt/BA/` |
| PS | Palestine | 3 (1+1+1) | `photo_prompt/PS/` |
| YE | Yemen | 3 (1+1+1) | `photo_prompt/YE/` |
| LB | Lebanon | 1 (country only) | `photo_prompt/LB/` |
| IQ | Iraq | 1 (country only) | `photo_prompt/IQ/` |

## How to Start a Session

Give your AI agent the starting prompt from `photo_prompt/<CODE>/START.md`.
The agent follows this chain within its own folder:

```
START.md → CONTINUE.md → TODO.md → DATA_ENTRY.md
```

It updates `CONTINUE.md`, `TODO.md`, and `RESULT.md` after every microstep.

## The Hybrid Image Strategy

**Priority 1: Wikimedia Commons API** (Real Photos — Free, No API Key)
- Search query: `{English Name} landscape skyline documentary`
- Endpoint: `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={query}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json&origin=*`
- Use the `thumburl` (800px wide thumbnail, not the full original)

**Priority 2: Pexels API** (Stock Photos — Free with key)
- Endpoint: `https://api.pexels.com/v1/search?query={name} city&per_page=5`
- Header: `Authorization: ewiG5376RYte2k4jTQgh7RvKSqdYj8154vFPWAAjv9Xs47WoQBBol9Pe`
- Request small/medium size (`src.medium` or `src.tiny`)

**Priority 3: Pollinations AI** (Free, No API Key)
- URL: `https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true&seed={timestamp}`
- Prompt: `Realistic documentary photography of {name} skyline, aerial view, solemn tone, high resolution, 8k, no text, no watermarks, no people`

## Image Optimization

All downloaded images are **resized & compressed** server-side before upload:
1. Decode with `imagescript` Deno library
2. Resize to max **800px width** (maintain aspect ratio)
3. Re-encode as JPEG at **quality 80**
4. Target final size: **600–800 KB** (images exceeding this threshold get further compression)

## Execution Pattern

1. Query entity photo status via `gets`
2. Execute Hybrid Strategy for ONE entity
3. Write & run `_temp_image_upload.ts` (Deno)
4. Update tracking files, report, STOP

## Architecture

- **Backend URL:** `http://185.239.0.14:1406`
- **Lesan endpoint:** `{API_URL}/lesan`
- **Upload endpoint:** `{API_URL}/file/uploadFile`
- **Auth:** `token` header (NO "Bearer" prefix)
- **File model:** Stores uploaded files; `photo` is a single-file relation via `updateRelations`
- **API Key:** Pexels: `ewiG5376RYte2k4jTQgh7RvKSqdYj8154vFPWAAjv9Xs47WoQBBol9Pe`

## Adding a New Country

1. Copy `photo_prompt/TEMPLATE/` → `photo_prompt/<CODE>/`
2. Fill in template variables
3. Add one row to the table above
4. Done

## Database Totals (as of Jun 2026) — All Marked for Replacement

| Entity | Total | Needs New Photo |
|--------|:----:|:---------------:|
| Countries | 8 | 8 |
| Provinces | 33 | 33 |
| Cities | 74 | 74 |
| **Total** | **115** | **115** |
