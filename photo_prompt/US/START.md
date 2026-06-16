You are the Autonomous Image Entry Agent for the **United States** (`US`).

---

## 1. Reading Order

```
photo_prompt/US/START.md       ← you are here
photo_prompt/US/CONTINUE.md    ← current position
photo_prompt/US/TODO.md        ← checklist
photo_prompt/US/DATA_ENTRY.md  ← Hybrid Strategy, API patterns
```

---

## 2. Pre-Flight Checklist (before EACH microstep)

- [ ] Read `CONTINUE.md` → `TODO.md` — know which entity is next
- [ ] Read `DATA_ENTRY.md` — review Hybrid Strategy, upload flow, updateRelations
- [ ] Load `.env` credentials (copy from `.env.example` if missing)
- [ ] Query the DB — get all countries/provinces/cities with `photo` field to verify TODO matches reality
- [ ] Execute Hybrid Strategy for exactly **ONE entity**
- [ ] Update ALL 3 tracking files: `CONTINUE.md`, `TODO.md`, `RESULT.md`
- [ ] **Report summary and ASK "Continue to next microstep?" — WAIT for user. Never auto-advance.**

---

## 3. Country Info

| Property | Value |
|----------|-------|
| Country | United States |
| Code | US |
| ObjectId | `6a1f01ccc1b216fc5349f8fa` |
| Folder | `photo_prompt/US/` |
| API URL | from `.env` `API_URL` |
| Auth | `token` header (NO "Bearer" prefix) from `.env` `GHOST_TOKEN` |

---

## 4. Target List (Processing Order: Country → Province → City)

### Phase 1 ✅ Complete (11 provinces, 27 cities — RTE data complete, photos pending)
1. 🇺🇸 United States (country) — photo
2. California — Los Angeles, San Francisco, San Diego, San Jose
3. Texas — Houston, Dallas, Austin, San Antonio
4. New York — New York City, Buffalo, Albany, Rochester
5. Illinois — Chicago, Springfield, Aurora
6. Virginia — Richmond, Arlington, Virginia Beach
7. Washington D.C. — (province only)
8. Georgia — Atlanta, Savannah, Augusta
9. Pennsylvania — Philadelphia, Pittsburgh, Allentown
10. Florida — Miami, Orlando
11. Ohio — Columbus, Cleveland, Cincinnati
12. Michigan — Detroit, Flint, Grand Rapids

### Phase 2 🔄 In Progress (provinces + cities with RTE data, photos pending)
13. Alabama — Birmingham, Montgomery, Mobile, Huntsville
14. Alaska — Anchorage, Fairbanks, Juneau
15. Arizona — Phoenix, Tucson, Mesa, Flagstaff
16. Arkansas — Little Rock, Fayetteville, Fort Smith
17. Colorado — Denver, Colorado Springs, Aurora, Boulder
18. Connecticut — Hartford, New Haven, Bridgeport, Stamford
19. Delaware — Wilmington, Dover, Newark

### Phase 3 ❌ Not yet created (need entry_prompt work first)
Hawaii through Wyoming (33 remaining states + their cities)

---

## 5. Execution Pattern

> **CRITICAL:** After every microstep below, output a summary and ask **"Continue to next microstep?"** — then **WAIT**. Do NOT automatically advance.

### Step A: Query Entity Photo Status
```python
api({
    "service": "main", "model": "city",  # or "province" or "country"
    "act": "gets",
    "details": {
        "set": {"page": 1, "limit": 100},
        "get": {"_id": 1, "name": 1, "english_name": 1, "photo": {"_id": 1}}
    }
})
```

### Step B: Download & Upload Image — Write and run `_temp_image_upload.ts`

### Step C: Update Entity Relations
```python
api({
    "service": "main", "model": "city",  # or "province" or "country"
    "act": "updateRelations",
    "details": {
        "set": {"_id": "<entity_oid>", "photo": "<file_oid>"},
        "get": {"_id": 1, "photo": {"_id": 1, "name": 1}}
    }
})
```

### Step D: Update tracking files (TODO.md, RESULT.md, CONTINUE.md)

### Step E: Report & Pause — ask "Continue to next microstep?"

---

## 6. Status Report Format

```
✅ IMAGE ENTRY MICRO-STEP COMPLETED
- Entity Type: [Country / Province / City]
- Entity Name: [English Name]
- Image Source: [Wikimedia Commons / Pollinations AI]
- File ID: [MongoDB _id of uploaded file]
- Next Planned Step: [Next entity when user says "Continue"]
```

---

## 7. Critical Rules

| # | Rule | Why |
|---|------|-----|
| 1 | **Process EXACTLY ONE entity per response** | Writing + executing Deno scripts is slow; >1 causes timeouts |
| 2 | **Use `updateRelations` with `photo` key** | NOT `photoId` — uses `addRelation` with `replace: true` |
| 3 | **Compress images after download** — use `imagescript` to resize to max 800px width, JPEG q80, target 600-800KB | Prevents multi-MB images killing site performance |
| 4 | **No broken images** | Skip if <10KB; fall back to next source |
| 5 | **Cleanup temp scripts** | Delete `_temp_image_upload.ts` after execution |
| 6 | **No "Bearer" prefix** in token header | Lesan server rejects it |

---

## 9. Full Deno Script Template (with Image Compression)

Write `_temp_image_upload.ts` with this template, then run with `deno run --allow-net --allow-read --allow-write _temp_image_upload.ts`:

```typescript
import ImageScript from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const API_URL = Deno.env.get("API_URL") ?? "http://185.239.0.14:1406";
const GHOST_TOKEN = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTBjNDBhMmI1MjI4Mjc0NDExODdiMWIiLCJlbWFpbCI6ImhlbWVkYW5pQGdtYWlsLmNvbSIsImxldmVsIjoiR2hvc3QiLCJleHAiOjE3ODgxOTIyMzF9.Kg0hIoBMDQ82vNu6yg-Tc6jyCXPNDtJJxNfI48kKvcRcwUl9AdyvdcgiRG1Z5FFwnZIHgiupEM5C_o9MRgjs6Q";

async function optimizeImage(buffer: Uint8Array): Promise<Uint8Array> {
  const image = await ImageScript.decode(buffer);
  if (image.width > 800) {
    const ratio = 800 / image.width;
    image.resize(image.width * ratio, image.height * ratio);
  }
  let compressed = await image.encodeJPEG(80);
  if (compressed.length > 800 * 1024) {
    compressed = await image.encodeJPEG(60);
  }
  return compressed;
}

async function fetchImage(url: string): Promise<Uint8Array | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return new Uint8Array(await resp.arrayBuffer());
  } catch {
    return null;
  }
}

async function uploadFile(buffer: Uint8Array, filename: string): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: "image/jpeg" }), filename);
  const res = await fetch(`${API_URL}/file/uploadFile`, {
    method: "POST",
    headers: { "token": GHOST_TOKEN },
    body: formData,
  });
  const data = await res.json();
  return data.body?._id ?? null;
}

async function updateRelations(model: string, entityId: string, fileId: string) {
  const res = await fetch(`${API_URL}/lesan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "token": GHOST_TOKEN },
    body: JSON.stringify({
      service: "main", model, act: "updateRelations",
      details: { set: { _id: entityId, photo: fileId }, get: { _id: 1, photo: { _id: 1, name: 1 } } },
    }),
  });
  return await res.json();
}

// === CONFIG: EDIT THESE ===
const ENTITY_NAME = "United States";
const ENTITY_TYPE = "country";
const ENTITY_ID = "67f51cd53f631b9e7a57890a";
const WIKI_QUERY = encodeURIComponent("United States landscape skyline documentary");
const POLLINATIONS_PROMPT = encodeURIComponent(
  "Realistic documentary photography of United States skyline, aerial view, solemn tone, high resolution, 8k, no text, no watermarks, no people"
);

async function main() {
  let imgBuffer: Uint8Array | null = null;
  let source = "";

  // 1. Wikimedia Commons (thumburl, 800px)
  const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${WIKI_QUERY}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json&origin=*`;
  const wikiRes = await fetch(wikiUrl).then(r => r.json());
  const pages = wikiRes?.query?.pages;
  if (pages) {
    const page = Object.values(pages)[0] as any;
    const thumbUrl = page?.imageinfo?.[0]?.thumburl;
    if (thumbUrl) {
      imgBuffer = await fetchImage(thumbUrl);
      source = "Wikimedia Commons";
      console.log("Downloaded from Wikimedia Commons:", thumbUrl);
    }
  }

  // 2. Fallback Pexels
  if (!imgBuffer || imgBuffer.length < 10240) {
    const pexelUrl = `https://api.pexels.com/v1/search?query=${ENTITY_NAME.toLowerCase().replace(/\s+/g, "+")}+city&per_page=5`;
    const pexelRes = await fetch(pexelUrl, {
      headers: { Authorization: "ewiG5376RYte2k4jTQgh7RvKSqdYj8154vFPWAAjv9Xs47WoQBBol9Pe" },
    }).then(r => r.json());
    const photo = pexelRes?.photos?.[0];
    if (photo?.src?.medium) {
      imgBuffer = await fetchImage(photo.src.medium);
      source = "Pexels";
      console.log("Downloaded from Pexels:", photo.src.medium);
    }
  }

  // 3. Fallback Pollinations AI
  if (!imgBuffer || imgBuffer.length < 10240) {
    const aiUrl = `https://image.pollinations.ai/prompt/${POLLINATIONS_PROMPT}?width=800&height=600&nologo=true&seed=${Date.now()}`;
    imgBuffer = await fetchImage(aiUrl);
    source = "Pollinations AI";
    console.log("Downloaded from Pollinations AI");
  }

  if (!imgBuffer || imgBuffer.length < 10240) {
    console.error("All sources failed");
    Deno.exit(1);
  }

  console.log(`Source: ${source}, Size: ${(imgBuffer.length / 1024).toFixed(1)} KB`);

  // Optimize
  imgBuffer = await optimizeImage(imgBuffer);
  console.log(`After optimization: ${(imgBuffer.length / 1024).toFixed(1)} KB`);

  // Upload
  const fileId = await uploadFile(imgBuffer, `${ENTITY_NAME.replace(/\s+/g, "_")}.jpg`);
  if (!fileId) { console.error("Upload failed"); Deno.exit(1); }
  console.log(`Uploaded file ID: ${fileId}`);

  // Update relations
  const result = await updateRelations(ENTITY_TYPE, ENTITY_ID, fileId);
  console.log("Result:", JSON.stringify(result, null, 2));
}

main();
```

---

## 8. Query Helper (Python)

```python
import os, json, urllib.request
from pathlib import Path

env_path = Path('.env')
env_vars = {}
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                k, _, v = line.partition('=')
                env_vars[k.strip()] = v.strip()

API_URL = env_vars.get("API_URL", "http://185.239.0.14:1406")
LESAN_URL = f"{API_URL}/lesan"
GHOST_TOKEN = env_vars.get("GHOST_TOKEN")
HEADERS = {"Content-Type": "application/json", "token": GHOST_TOKEN}

def api(payload):
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(LESAN_URL, data=data, headers=HEADERS, method='POST')
    return json.loads(urllib.request.urlopen(req).read())
```
