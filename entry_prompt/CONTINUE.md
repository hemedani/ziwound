# ZiWound — Autonomous Data Entry: Master Continuation Guide

> **Reading Order:** START HERE → `entry_prompt/TODO.md` → `entry_prompt/<COUNTRY>/DATA_ENTRY.md`

---

## 1. 📋 Your Job

You are an AI Agent tasked with populating the ZiWound database with war-crimes documentation from an anti-imperialist perspective. You work in **micro-steps** (exactly 2 RTE fields per response), updating tracking files after every step and then **PAUSING to ask the user** "Continue to next microstep?" — never proceed without explicit confirmation. The user will reply with a new prompt to continue.

---

## 2. 🗺️ Finding Your Place

### 2a. Read the country-level TODO
```text
entry_prompt/TODO.md     ← Which country are we on?
```

### 2b. Read the country folder
```text
entry_prompt/HR/DATA_ENTRY.md    ← The prompt with rules, API patterns, target list
entry_prompt/HR/TODO.md          ← Which province/city are we on? Which fields?
entry_prompt/HR/RESULT.md        ← What's been completed so far
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

# Get current country (Croatia)
api({"service":"main","model":"country","act":"gets","details":{"set":{"page":1,"limit":10},"get":{"_id":1,"name":1,"english_name":1}}})
# Look for english_name == "Croatia", get its _id

# Find which province we're on
api({"service":"main","model":"province","act":"gets","details":{"set":{"page":1,"limit":50},"get":{"_id":1,"name":1}}})

# Check what cities exist in that province
api({"service":"main","model":"city","act":"gets","details":{"set":{"provinceId":"<province_oid>","page":1,"limit":20},"get":{"_id":1,"name":1}}})
```

---

## 3. ⚡ Execution Pattern — Pause After Every Step (Exactly 2 Fields)

> **⚠️ CRITICAL: After completing a microstep below, you MUST output a clear summary and ask "Continue to next microstep?" — then WAIT for the user to respond before proceeding. Do NOT automatically advance.**

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
            "countryId": "<country_oid>",
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
Update ALL four files before reporting (then **PAUSE and ask user to continue**):

| File | What to change |
|------|---------------|
| `entry_prompt/HR/TODO.md` | Update the progress bar for the city: `[##--------]` → `[####------]` |
| `entry_prompt/HR/RESULT.md` | Update field count in city table, add ObjectIds |
| `entry_prompt/TODO.md` | Only if a country becomes complete |
| `entry_prompt/CONTINUE.md` | Update "Current Position" section below |

---

## 4. 🎯 Current Position

> **Active Country:** Croatia (`entry_prompt/HR/`) 🔄
> **Current:** Sisačko-moslavačka province (0/10) + Sisak city (6/10)
> **Next:** Fill fields 7–8 for Sisak city (civilian_impact + mass_graves_info)

## 5. ➡️ Next Steps (planned order)

### Phase — Croatia 🔄 In Progress
1. ✅ **Croatia — Grad Zagreb + Zagreb city** (10/10) ✅
2. ✅ **Croatia — Vukovarsko-srijemska + Vukovar city** (10/10) ✅
3. ✅ **Croatia — Dubrovačko-neretvanska province** (10/10) ✅
4. ✅ **Croatia — Dubrovnik city** (10/10) ✅
5. ✅ **Croatia — Osječko-baranjska province (10/10)** + **Osijek city** (10/10 ✅)
6. ✅ Croatia — Splitsko-dalmatinska province (10/10) + Split city (10/10 ✅)
7. 🔄 Croatia — Sisačko-moslavačka province (0/10) + Sisak city (4/10)
8. ⬜ Croatia — Zadarska province + Zadar city
9. ⬜ Croatia — Karlovačka province + Karlovac city
10. ⬜ Croatia — Šibensko-kninska province + Knin city
11. ⬜ Croatia — Ličko-senjska province + Gospić city

### Future
12. ⬜ United Kingdom (GB)
13. ⬜ Germany (DE)
14. ⬜ France (FR)

---

## ⚠️ 5b. 🇺🇸 United States — Half-Finished (Paused — Resume After Croatia)

The US data entry was **left half-finished** when work shifted to Croatia. The current state:

| Status | Details |
|--------|---------|
| ✅ Phase 1 Complete | 11 provinces + Washington DC + 27 cities — all 10/10 |
| ✅ Phase 2 Partial | 6 provinces + 4 cities done (Alabama through Connecticut) |
| ❌ Phase 2 Remaining | **39 provinces + their cities not yet created or populated** |

**🚨 CRITICAL: When Croatia reaches 10/10 across all provinces/cities, the very next task is to return to `entry_prompt/US/` and continue from where we left off (Delaware onward). Do NOT skip to another country. Do NOT proceed until the US is fully finished.**

## 6. 🚨 Critical Rules (Violations = Data Loss)

| Rule | Why |
|------|-----|
| **⚠️ DATA MUST BE RESEARCH-BASED, DETAILED & COMPREHENSIVE** | After a few microsteps, agents tend to stop searching the internet and fabricate or recycle generic content. **You MUST search the internet for each city/province** to find real historical war crimes, casualties, battles, and events. Every entry must be **detailed** (multiple paragraphs, specific dates, names, numbers) and **comprehensive** (cover the full range of wars and conflicts relevant to that location). Never reuse content from another city. |
| **⚠️ INTERNET RESEARCH IS MANDATORY FOR EVERY STEP** | Do NOT rely on your training data alone. Search the web for each specific entity before writing any content. The data must be factual, citeable, and specific to the location. Generic or recycled content will be rejected. |
| **Send ALL 9 languages** on every RTE update | `update` replaces the field — missing languages are **erased** |
| **`name` is the native-language name** | `name` = country/province/city name in the local language; `english_name` = English translation for international use. Both are plain strings, NOT objects |
| **Include `isCapital`** in city.add | Missing it causes a 501 error |
| **No "Bearer" prefix** in token header | The Lesan server does not expect it |
| **Never cram events** into one `<p>` | Timeline fields must have one `<h4>` + one `<p>` per event |
| **Never do > 2 fields** per response | Micro-stepping is enforced |
| **Update tracking files** after EVERY step | Otherwise the next agent won't know where to start |
| **🔍 If query results lack proper content, make a strong case for fixing it first** | If the text for something you query doesn't have the right data (missing fields, generic content, wrong/empty values), STOP, report the issue clearly, argue strongly for fixing it, and only move on once it's resolved. Never silently proceed with poor data. |

## 7. 🔧 API Gotchas

- **`province.get` / `city.get` (single) → returns 501.** Use `gets` with filters instead.
- **`city.add` → returns 501** unless you include ALL of: `name`, `english_name`, `provinceId`, `countryId`, `isCapital`
- **Province fields** follow the same schema as City (same 10 RTE fields)
- **Token expiry:** If you get auth errors, the token may have expired. The user will provide a new one.

## 8. 🏛️ Key ObjectIds (Active Country: Croatia)

| Entity | ObjectId |
|--------|----------|
| Croatia (country) | `6a12a0a084ffe580f176d0ef` |
| Grad Zagreb | `6a21d6a5fa501fcbe2807b32` |
| Zagreb | `6a21d6b0fa501fcbe2807b33` |
| Vukovarsko-srijemska | `6a21d83ffa501fcbe2807b34` |
| Vukovar | `6a21d847fa501fcbe2807b35` |
| Dubrovačko-neretvanska | `6a227230cf597f7ec55684a2` |
| Dubrovnik | `6a227238cf597f7ec55684a3` |
| Osječko-baranjska | `6a22c486cf597f7ec55684b0` |
| Osijek | `6a22c48dcf597f7ec55684b1` |
| Splitsko-dalmatinska | `6a255c60cf597f7ec55684b3` |
| Split | `6a255c6ecf597f7ec55684b4` | |

> For US ObjectIds reference, see `entry_prompt/US/RESULT.md`.

---

## 9. 📁 File Tree Reference

```
entry_prompt/
├── CONTINUE.md          ← YOU ARE HERE (master guide)
├── TODO.md              ← Country-level checklist
│
├── HR/                  ← Croatia (ACTIVE 🔄)
│   ├── DATA_ENTRY.md    ← Full prompt for Croatia data entry
│   ├── TODO.md          ← Province/city checklist
│   └── RESULT.md        ← Completion summary
│
├── US/                  ← United States (PAUSED — resume after Croatia)
│   ├── DATA_ENTRY.md    ← Full prompt for US data entry
│   ├── TODO.md          ← Province/city checklist (half-finished)
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

- [ ] **🔍 SEARCH THE INTERNET** for this specific city/province's war history — do NOT rely on memory
- [ ] Read `entry_prompt/CONTINUE.md` — know the current position
- [ ] Read `entry_prompt/HR/TODO.md` — confirm which city/fields are next
- [ ] Read `entry_prompt/HR/DATA_ENTRY.md` — review formatting rules
- [ ] Load `.env` credentials (or copy from `.env.example`)
- [ ] Query the DB — verify the TODO matches reality; **if data is missing/bad, argue to fix it first**
- [ ] Generate **detailed, comprehensive** content for **exactly 2 fields × 9 languages** — each field must have real data with specific dates, names, numbers
- [ ] Verify HTML tag parity across all 9 languages
- [ ] Send the update
- [ ] Update ALL tracking files (TODO.md, RESULT.md, CONTINUE.md)
- [ ] **Report summary and ASK "Continue to next microstep?" — WAIT for user response**
