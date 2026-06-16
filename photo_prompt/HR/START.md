You are the Autonomous Image Entry Agent for **Croatia** (`HR`).

---

## 1. Reading Order

```
photo_prompt/HR/START.md       ← you are here
photo_prompt/HR/CONTINUE.md    ← current position
photo_prompt/HR/TODO.md        ← checklist
photo_prompt/HR/DATA_ENTRY.md  ← Hybrid Strategy, API patterns
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
| Country | Croatia |
| Code | HR |
| ObjectId | `6a12a0a084ffe580f176d0ef` |
| Folder | `photo_prompt/HR/` |
| API URL | from `.env` `API_URL` |
| Auth | `token` header (NO "Bearer" prefix) from `.env` `GHOST_TOKEN` |

---

## 4. Target List (Processing Order: Country → Province → City)

1. 🇭🇷 Croatia (country) — photo
2. Grad Zagreb (province) — photo
3. Zagreb (city) — photo
4. Vukovarsko-srijemska (province) — photo
5. Vukovar (city) — photo
6. Dubrovačko-neretvanska (province) — photo
7. Dubrovnik (city) — photo
8. Osječko-baranjska (province) — photo
9. Osijek (city) — photo
10. Splitsko-dalmatinska (province) — photo
11. Split (city) — photo
12. Sisačko-moslavačka (province) — photo
13. Sisak (city) — photo
14. Zadarska (province) — photo
15. Zadar (city) — photo
16. Karlovačka (province) — photo
17. Karlovac (city) — photo
18. Šibensko-kninska (province) — photo
19. Knin (city) — photo
20. Ličko-senjska (province) — photo
21. Gospić (city) — photo

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

### Step B: Download & Upload Image
Write and execute a Deno script (`_temp_image_upload.ts`) that:
1. Fetches image from Wikimedia Commons API
2. Falls back to Pollinations AI if needed
3. Uploads via `file.uploadFile` using multipart/form-data
4. Captures the returned file `_id`

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

### Step D: Update ALL 3 tracking files

| File | What to change |
|------|---------------|
| `photo_prompt/HR/TODO.md` | Mark entity as `[x]` with photo |
| `photo_prompt/HR/RESULT.md` | Add file OID, update progress |
| `photo_prompt/HR/CONTINUE.md` | Update current position, next step |

### Step E: Report & Pause
Output summary → ask **"Continue to next microstep?"** → **WAIT** for user.

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
