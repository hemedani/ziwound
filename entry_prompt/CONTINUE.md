# ZiWound — Autonomous Data Entry: Master Continuation Guide

> **Reading Order:** START HERE → `entry_prompt/TODO.md` → `entry_prompt/<COUNTRY>/DATA_ENTRY.md`

---

## 1. 📋 Your Job

You are an AI Agent tasked with populating the ZiWound database with war-crimes documentation from an anti-imperialist perspective. You work in **micro-steps** (exactly 2 RTE fields per response), and you **update the tracking files** after every step.

---

## 2. 🗺️ Finding Your Place

### 2a. Read the country-level TODO
```text
entry_prompt/TODO.md     ← Which country are we on?
```

### 2b. Read the country folder
```text
entry_prompt/US/DATA_ENTRY.md    ← The prompt with rules, API patterns, target list
entry_prompt/US/TODO.md          ← Which province/city are we on? Which fields?
entry_prompt/US/RESULT.md        ← What's been completed so far
```

### 2c. Load credentials from `.env`
The project root `.env` file contains `API_URL` and `GHOST_TOKEN`. Copy `.env.example` if needed.

```python
import os, json, urllib.request
from pathlib import Path

# Load .env from project root (run scripts from project root)
env_path = Path('.env')
env_vars = {}
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                k, _, v = line.partition('=')
                env_vars[k.strip()] = v.strip()

API_URL = env_vars.get("API_URL", "http://185.239.0.14:1406") + "/lesan"
GHOST_TOKEN = env_vars.get("GHOST_TOKEN")
HEADERS = {"Content-Type": "application/json", "token": GHOST_TOKEN}
def api(payload):
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(API_URL, data=data, headers=HEADERS, method='POST')
    return json.loads(urllib.request.urlopen(req).read())

# Get USA
api({"service":"main","model":"country","act":"gets","details":{"set":{"page":1,"limit":10},"get":{"_id":1,"name":1,"english_name":1}}})
# Look for english_name == "United States", get its _id

# Find which province we're on
api({"service":"main","model":"province","act":"gets","details":{"set":{"page":1,"limit":50},"get":{"_id":1,"name":1}}})

# Check what cities exist in that province
api({"service":"main","model":"city","act":"gets","details":{"set":{"provinceId":"<province_oid>","page":1,"limit":20},"get":{"_id":1,"name":1}}})
```

---

## 3. ⚡ Execution Pattern (Exactly 2 Fields)

### Step A: Create province/city if needed
```python
# Province creation
api({
    "service": "main", "model": "province", "act": "add",
    "details": {
        "set": {
            "name": "نام استان",           # Native-language name
            "english_name": "State Name",   # English translation
            "countryId": "<country_oid>",
            "isCapital": False
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Step A2: Create city if needed
```python
api({
    "service": "main", "model": "city", "act": "add",
    "details": {
        "set": {
            "name": "City Name",         # Plain string (NOT an object!)
            "english_name": "City Name", # Plain string
            "provinceId": "<province_oid>",
            "countryId": "<usa_oid>",
            "isCapital": False           # Boolean, REQUIRED
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Step B: Generate RTE content for 2 fields
- Follow `DATA_ENTRY.md` HTML formatting rules
- Write ALL 9 languages with identical structure
- Verify tag counts before sending

### Step C: Update the city
```python
api({
    "service": "main", "model": "city", "act": "update",
    "details": {
        "set": {
            "_id": "<city_oid>",
            "field1": {"fa": "...", "en": "...", "ar": "...", "zh": "...", "pt": "...", "es": "...", "nl": "...", "tr": "...", "ru": "..."},
            "field2": {"fa": "...", "en": "...", "ar": "...", "zh": "...", "pt": "...", "es": "...", "nl": "...", "tr": "...", "ru": "..."}
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Step D: Update tracking files
Update ALL four files before reporting:

| File | What to change |
|------|---------------|
| `entry_prompt/US/TODO.md` | Update the progress bar for the city: `[##--------]` → `[####------]` |
| `entry_prompt/US/RESULT.md` | Update field count in city table, add ObjectIds |
| `entry_prompt/TODO.md` | Only if a country becomes complete |
| `entry_prompt/CONTINUE.md` | Update "Current Position" section below |

---

## 4. 🎯 Current Position

> **Active Country:** United States (`entry_prompt/US/`) — Phase 2 🔄
> **Current:** Alabama — Montgomery [########--] 8/10 (wars_history, conflict_timeline, casualties_info, notable_battles, occupation_info, destruction_level, civilian_impact, mass_graves_info done)
> **Next:** Montgomery — war_crimes_events + liberation_info (fields 9-10)

## 5. ➡️ Next Steps (planned order)

### Phase 2 🔄 In Progress
1. 🔄 **United States** — Phase 1 complete ✅ (11 provinces, 27 cities)
2. 🔄 Phase 2 — Alabama: Birmingham [##########] 10/10 ✅, Montgomery [########--] 8/10, then Mobile/Huntsville

### Future (after US Phase 2)
3. ⬜ United Kingdom (GB)
4. ⬜ Germany (DE)
5. ⬜ France (FR)
6. ⬜ Croatia — 10 provinces, 10 cities (HOLD — may resume)

---

## 6. 🚨 Critical Rules (Violations = Data Loss)

| Rule | Why |
|------|-----|
| **Send ALL 9 languages** on every RTE update | `update` replaces the field — missing languages are **erased** |
| **`name` is the native-language name** | `name` = country/province/city name in the local language; `english_name` = English translation for international use. Both are plain strings, NOT objects |
| **Include `isCapital`** in city.add | Missing it causes a 501 error |
| **No "Bearer" prefix** in token header | The Lesan server does not expect it |
| **Never cram events** into one `<p>` | Timeline fields must have one `<h4>` + one `<p>` per event |
| **Never do > 2 fields** per response | Micro-stepping is enforced |
| **Update tracking files** after EVERY step | Otherwise the next agent won't know where to start |

## 7. 🔧 API Gotchas

- **`province.get` / `city.get` (single) → returns 501.** Use `gets` with filters instead.
- **`city.add` → returns 501** unless you include ALL of: `name`, `english_name`, `provinceId`, `countryId`, `isCapital`
- **Province fields** follow the same schema as City (same 10 RTE fields)
- **Token expiry:** If you get auth errors, the token may have expired. The user will provide a new one.

## 8. 🏛️ Key ObjectIds (USA)

| Entity | ObjectId |
|--------|----------|
| USA Country | `6a1f01ccc1b216fc5349f8fa` |
| California | `6a1f28cfc1b216fc5349f8fb` |
| Texas | `6a1f306fc1b216fc5349f8ff` |
| New York | `6a1f363dc1b216fc5349f903` |
| Illinois | `6a1f3980c1b216fc5349f905` |
| Virginia | `6a1f3b10c1b216fc5349f907` |
| Washington DC | `6a1f3d20c1b216fc5349f90a` |
| Georgia | `6a1f3dc3c1b216fc5349f90b` |
| Pennsylvania | `6a1f3fb9c1b216fc5349f90e` |
| Florida | `6a1f419cc1b216fc5349f911` |
| Ohio | `6a1fcae5c1b216fc5349f914` |
| Michigan | `6a1fcd84c1b216fc5349f918` |

---

## 9. 📁 File Tree Reference

```
entry_prompt/
├── CONTINUE.md          ← YOU ARE HERE (master guide)
├── TODO.md              ← Country-level checklist
│
├── US/                  ← United States (ACTIVE)
│   ├── DATA_ENTRY.md    ← Full prompt for US data entry
│   ├── TODO.md          ← Province/city checklist
│   └── RESULT.md        ← Completion summary
│
├── GB/                  ← United Kingdom (future)
│   ├── DATA_ENTRY.md    ← (customize from US template)
│   ├── TODO.md          ← (populate with UK provinces/cities)
│   └── RESULT.md        ← (update as work progresses)
│
└── ... (other countries)
```

---

## 10. ☑️ Pre-Flight Checklist (before each step)

- [ ] Read `entry_prompt/CONTINUE.md` — know the current position
- [ ] Read `entry_prompt/US/TODO.md` — confirm which city/fields are next
- [ ] Read `entry_prompt/US/DATA_ENTRY.md` — review formatting rules
- [ ] Load `.env` credentials (or copy from `.env.example`)
- [ ] Query the DB — verify the TODO matches reality
- [ ] Generate content for **exactly 2 fields × 9 languages**
- [ ] Verify HTML tag parity across all 9 languages
- [ ] Send the update
- [ ] Update ALL tracking files (TODO.md, RESULT.md, CONTINUE.md)
- [ ] Report and STOP
