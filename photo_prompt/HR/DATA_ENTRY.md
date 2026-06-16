# Croatia — Hybrid Image Strategy Prompt

You are the Autonomous Image Entry Agent for "ZiWound," operating directly within the project root directory. You have full access to the Deno runtime and local file system. If you lose context regarding the Lesan framework or API structure, you MUST read `back/AGENTS.md`.

Your mission is to autonomously populate the `photo` relation for all Countries, Provinces, and Cities in Croatia using a **Hybrid Image Strategy**.

## 🔐 System Access

- **Backend URL:** from `.env` (`API_URL`, default `http://185.239.0.14:1406`)
- **Ghost Token:** from `.env` (`GHOST_TOKEN`)
- **Token Header:** `token` (NO "Bearer" prefix)
- **Croatia Country ObjectId:** `6a12a0a084ffe580f176d0ef`

## 🎯 Target List (Processing Order)

1. 🇭🇷 Croatia (country) `6a12a0a084ffe580f176d0ef`
2. Grad Zagreb (province) `6a21d6a5fa501fcbe2807b32` — Zagreb (city) `6a21d6b0fa501fcbe2807b33`
3. Vukovarsko-srijemska (province) `6a21d83ffa501fcbe2807b34` — Vukovar (city) `6a21d847fa501fcbe2807b35`
4. Dubrovačko-neretvanska (province) `6a227230cf597f7ec55684a2` — Dubrovnik (city) `6a227238cf597f7ec55684a3`
5. Osječko-baranjska (province) `6a22c486cf597f7ec55684b0` — Osijek (city) `6a22c48dcf597f7ec55684b1`
6. Splitsko-dalmatinska (province) `6a255c60cf597f7ec55684b3` — Split (city) `6a255c6ecf597f7ec55684b4`
7. Sisačko-moslavačka (province) `6a256366cf597f7ec55684b5` — Sisak (city) `6a256366cf597f7ec55684b6`
8. Zadarska (province) — Zadar (city) ❌ may need creation
9. Karlovačka (province) — Karlovac (city) ❌ may need creation
10. Šibensko-kninska (province) — Knin (city) ❌ may need creation
11. Ličko-senjska (province) — Gospić (city) ❌ may need creation

## 🎨 THE HYBRID IMAGE STRATEGY

**Priority 1: Wikimedia Commons API** — `{english_name} landscape skyline documentary`

**Priority 2: Pollinations AI** — `Realistic documentary photography of {english_name} skyline, aerial view, solemn tone, high resolution, 8k, no text, no watermarks, no people`

## ⚙️ TECHNICAL EXECUTION

Write and execute a temporary Deno script (`_temp_image_upload.ts`) that:

1. Downloads image from Wikimedia Commons or Pollinations AI
2. Uploads to Lesan via `file.uploadFile` (multipart/form-data)
3. Updates entity relations via `updateRelations` with the file ID

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

## 🔄 WORKFLOW

**STEP 1:** Query DB to find first entity missing a photo
**STEP 2:** Write & execute Deno script for ONE entity
**STEP 3:** Update tracking files, report, STOP — ask "Continue?"

## 🚫 Banned
- ❌ Processing >1 entity per response
- ❌ Using `photoId` in `updateRelations` — use `photo`
- ❌ Broken images (<10KB)
- ❌ Leaving temp scripts uncleaned
- ❌ Bearer prefix in token header

## 📁 Tracking Files

| File | Path |
|------|------|
| TODO.md | `photo_prompt/HR/TODO.md` |
| RESULT.md | `photo_prompt/HR/RESULT.md` |
| CONTINUE.md | `photo_prompt/HR/CONTINUE.md` |
