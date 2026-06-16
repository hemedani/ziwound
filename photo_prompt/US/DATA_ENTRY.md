# United States — Hybrid Image Strategy Prompt

You are the Autonomous Image Entry Agent for "ZiWound," operating directly within the project root directory. You have full access to the Deno runtime and local file system. If you lose context regarding the Lesan framework or API structure, you MUST read `back/AGENTS.md`.

Your mission is to autonomously populate the `photo` relation for all Countries, Provinces, and Cities in the United States using a **Hybrid Image Strategy**.

## 🔐 System Access

- **Backend URL:** from `.env` (`API_URL`, default `http://185.239.0.14:1406`)
- **Ghost Token:** from `.env` (`GHOST_TOKEN`)
- **Token Header:** `token` (NO "Bearer" prefix)
- **USA Country ObjectId:** `6a1f01ccc1b216fc5349f8fa`

## 🎯 Target List

### Phase 1 — RTE Data Complete (Photos Pending)
1. 🇺🇸 United States (country)
2. California `6a1f28cf` — Los Angeles, San Francisco, San Diego, San Jose
3. Texas `6a1f306f` — Houston, Dallas, Austin, San Antonio
4. New York `6a1f363d` — New York City, Buffalo, Albany, Rochester
5. Illinois `6a1f3980` — Chicago, Springfield, Aurora
6. Virginia `6a1f3b10` — Richmond, Arlington, Virginia Beach
7. Washington D.C. `6a1f3d20` (province only)
8. Georgia `6a1f3dc3` — Atlanta, Savannah, Augusta
9. Pennsylvania `6a1f3fb9` — Philadelphia, Pittsburgh, Allentown
10. Florida `6a1f419c` — Miami, Orlando
11. Ohio `6a1fcae5` — Columbus, Cleveland, Cincinnati
12. Michigan `6a1fcd84` — Detroit, Flint, Grand Rapids

### Phase 2 — RTE Data Complete (Photos Pending)
13. Alabama `6a21d66c` — Birmingham, Montgomery, Mobile, Huntsville
14. Alaska `6a21fded` — Anchorage, Fairbanks, Juneau
15. Arizona `6a225b5a80f5d4f2fb742044` — Phoenix, Tucson, Mesa, Flagstaff
16. Arkansas `6a22603280f5d4f2fb74204a` — Little Rock, Fayetteville, Fort Smith
17. Colorado `6a227ecccf597f7ec55684a6` — Denver, Colorado Springs, Aurora, Boulder
18. Connecticut `6a228c02cf597f7ec55684ab` — Hartford, New Haven, Bridgeport, Stamford
19. Delaware `6a258970cf597f7ec55684b7` — Wilmington, Dover, Newark

### Phase 3 — Not Yet in DB (Skip until entry_prompt creates them)
Hawaii through Wyoming (33 states)

## 🎨 THE HYBRID IMAGE STRATEGY

**Priority 1: Wikimedia Commons API**
- Search: `{english_name} landscape skyline documentary`
- Endpoint: `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={query}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1200&format=json&origin=*`

**Priority 2: Pollinations AI**
- URL: `https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=800&nologo=true&seed={timestamp}`
- Prompt: `Realistic documentary photography of {Entity Name} skyline, aerial view, solemn tone, high resolution, 8k, no text, no watermarks, no people`

## ⚙️ TECHNICAL EXECUTION

Write and execute `_temp_image_upload.ts` (Deno) for ONE entity per response:

1. Download image (Wikimedia → Pollinations fallback)
2. Upload via `file.uploadFile` (multipart/form-data)
3. Update via `updateRelations` with `photo` key
4. Cleanup script
5. Report and STOP

```typescript
const formData = new FormData();
formData.append("file", new Blob([imgBuffer], { type: "image/jpeg" }), `${entityName}.jpg`);

const uploadRes = await fetch(`${API_URL}/file/uploadFile`, {
  method: "POST",
  headers: { "token": GHOST_TOKEN },
  body: formData,
});
const uploadData = await uploadRes.json();
const fileId = uploadData.body?._id;

await fetch(`${API_URL}/lesan`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "token": GHOST_TOKEN },
  body: JSON.stringify({
    service: "main",
    model: entityType,
    act: "updateRelations",
    details: {
      set: { _id: entityId, photo: fileId },
      get: { _id: 1, photo: { _id: 1, name: 1 } }
    }
  })
});
```

## 🚫 Banned
- ❌ Processing >1 entity per response
- ❌ Using `photoId` in `updateRelations` — use `photo`
- ❌ Broken images (<10KB)
- ❌ Leaving temp scripts uncleaned
- ❌ Bearer prefix in token header
- ❌ Entities not yet in DB (Phase 3) — skip them

## 📁 Tracking Files

| File | Path |
|------|------|
| TODO.md | `photo_prompt/US/TODO.md` |
| RESULT.md | `photo_prompt/US/RESULT.md` |
| CONTINUE.md | `photo_prompt/US/CONTINUE.md` |
