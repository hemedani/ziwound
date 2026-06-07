You are a ZiWound data entry agent for **Croatia** (`HR`).

---

## 1. Reading Order

Every session starts here. Read these in order to find your exact position:

```
entry_prompt/HR/START.md       ← you are here
entry_prompt/HR/CONTINUE.md    ← current position
entry_prompt/HR/TODO.md        ← checklist
entry_prompt/HR/DATA_ENTRY.md  ← field defs, API patterns, HTML rules
```

---

## 2. Pre-Flight Checklist (before EACH microstep)

- [ ] **🔍 SEARCH THE INTERNET** for this specific city/province — find real wars, battles, casualties, massacres, occupation periods with **specific dates, names, locations, and numbers**. Do NOT rely on memory. Do NOT fabricate or recycle.
- [ ] Read `CONTINUE.md` → `TODO.md` — know which city and which 2 fields are next
- [ ] Read `DATA_ENTRY.md` — review HTML formatting, API patterns, banned list
- [ ] Load `.env` credentials (copy from `.env.example` if missing)
- [ ] Query the DB — verify the TODO matches reality; **if data is missing/bad, STOP and argue to fix it first. Do NOT silently proceed.**
- [ ] Generate **detailed, comprehensive** content for exactly **2 fields × 9 languages** — each field must have real data with specific dates, names, numbers
- [ ] **Verify HTML tag count parity** across all 9 languages before sending (e.g. `content.count('<h4>')`)
- [ ] Send the update via API
- [ ] Update ALL 3 tracking files: `CONTINUE.md`, `TODO.md`, `RESULT.md`
- [ ] **Report summary and ASK "Continue to next microstep?" — WAIT for user. Never auto-advance.**

---

## 3. Country Info

| Property | Value |
|----------|-------|
| Country | Croatia |
| Code | HR |
| ObjectId | `6a12a0a084ffe580f176d0ef` |
| Folder | `entry_prompt/HR/` |
| API URL | from `.env` `API_URL` + `/lesan` |
| Auth | `token` header (NO "Bearer" prefix) from `.env` `GHOST_TOKEN` |

---

## 4. Target List

### Provinces (Županije) + Cities
1. Grad Zagreb — Zagreb ✅
2. Vukovarsko-srijemska — Vukovar ✅
3. Dubrovačko-neretvanska — Dubrovnik ✅
4. Osječko-baranjska — Osijek ✅
5. Splitsko-dalmatinska — Split ✅
6. 🔄 Sisačko-moslavačka — Sisak (8/10)
7. ⬜ Zadarska — Zadar
8. ⬜ Karlovačka — Karlovac
9. ⬜ Šibensko-kninska — Knin
10. ⬜ Ličko-senjska — Gospić

**10 RTE Fields (per city AND per province):**

| # | Field | Type |
|---|-------|------|
| 1 | `wars_history` | Narrative |
| 2 | `conflict_timeline` | Timeline |
| 3 | `casualties_info` | Statistics |
| 4 | `notable_battles` | Narrative |
| 5 | `occupation_info` | Narrative |
| 6 | `destruction_level` | Statistics |
| 7 | `civilian_impact` | Narrative |
| 8 | `mass_graves_info` | Narrative |
| 9 | `war_crimes_events` | Narrative |
| 10 | `liberation_info` | Narrative |

---

## 5. Execution Pattern

> **CRITICAL:** After every microstep below, output a summary and ask **"Continue to next microstep?"** — then **WAIT**. Do NOT automatically advance.

### Step A: Create province if it doesn't exist in DB
```python
api({
    "service": "main", "model": "province", "act": "add",
    "details": {
        "set": {
            "name": "Ime pokrajine",        # Native-language name (plain string)
            "english_name": "Province Name", # English translation
            "countryId": "6a12a0a084ffe580f176d0ef",
            "isCapital": False               # Boolean, REQUIRED
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Step B: Create city if it doesn't exist in DB
```python
api({
    "service": "main", "model": "city", "act": "add",
    "details": {
        "set": {
            "name": "Ime grada",            # Native-language name (plain string)
            "english_name": "City Name",     # English translation
            "provinceId": "<province_oid>",
            "countryId": "6a12a0a084ffe580f176d0ef",
            "isCapital": False               # Boolean, REQUIRED
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Step C: Generate content for 2 RTE fields
- Research each field thoroughly — find real events with specific dates/numbers
- Write ALL 9 languages (`fa`, `en`, `ar`, `zh`, `pt`, `es`, `nl`, `tr`, `ru`) with **identical structure**
- Count HTML tags in each language — they MUST match exactly
- Each field must be **detailed and comprehensive** (multiple paragraphs, real data — not vague/generic)
- Cover the **full historical scope** — from ancient conflicts through WWI, WWII, Croatian War of Independence

### Step D: Update the city/province
```python
api({
    "service": "main", "model": "city", "act": "update",
    "details": {
        "set": {
            "_id": "<city_or_province_oid>",
            "field1": {"fa": "...", "en": "...", "ar": "...", "zh": "...", "pt": "...", "es": "...", "nl": "...", "tr": "...", "ru": "..."},
            "field2": {"fa": "...", "en": "...", "ar": "...", "zh": "...", "pt": "...", "es": "...", "nl": "...", "tr": "...", "ru": "..."}
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Step E: Update ALL 3 tracking files

| File | What to change |
|------|---------------|
| `entry_prompt/HR/TODO.md` | Update progress bar: `[##--------]` → `[####------]` |
| `entry_prompt/HR/RESULT.md` | Update field counts, add ObjectIds |
| `entry_prompt/HR/CONTINUE.md` | Update current position, next step, progress numbers |

### Step F: Report & Pause
Output summary → ask **"Continue to next microstep?"** → **WAIT** for user.

---

## 6. HTML Formatting Standards

### Timeline Fields (`conflict_timeline`)
```
<h3>Conflict Timeline</h3>
<h4>1991: Event Name</h4><p>Description with specific details...</p>
```
- Each event = one `<h4>` + one `<p>` — NEVER cram multiple events into one `<p>`

### Narrative Fields (all others except statistics)
```
<h3>Section Title</h3>
<p>Paragraph with <strong>key data</strong>...</p>
<h4>Sub-section</h4>
<p>Details...</p>
<ul>
  <li><strong>Date:</strong> Description...</li>
</ul>
```
- Use `<h3>` for main sections, `<h4>` for sub-sections
- `<ul>/<li>` for listing incidents, statistics, laws
- `<strong>` to highlight dates, numbers, names

### Statistics Fields (`casualties_info`, `destruction_level`)
```
<h4>Category</h4>
<ul>
  <li><strong>Data Point:</strong> Value and description...</li>
</ul>
```

---

## 7. Critical Rules (Violations = Data Loss)

| # | Rule | Why |
|---|------|-----|
| 1 | **🔍 INTERNET RESEARCH REQUIRED FOR EVERY STEP** | Agents tend to fabricate after a few steps. Every entry must have specific dates, names, numbers from real history. |
| 2 | **Send ALL 9 languages** on every update | `update` replaces the field — missing languages are **erased** |
| 3 | **`name` is the native-language name** | `name` = local name (plain string); `english_name` = English translation |
| 4 | **Include `isCapital` in `city.add`** | Missing it causes a 501 error |
| 5 | **No "Bearer" prefix** in token header | The Lesan server does not expect it |
| 6 | **Never do > 2 fields** per response | Micro-stepping is enforced |
| 7 | **Verify HTML tag parity** across ALL 9 languages | Structural mismatch causes rendering bugs |
| 8 | **If DB data is missing/bad, STOP and argue** | Never silently proceed with poor data |
| 9 | **Never reuse content** from another city | Each location has a unique history |

---

## 8. API Gotchas

- **`province.get` / `city.get` (single) → 501.** Use `gets` with filters instead.
- **`city.add` → 501** unless you include ALL of: `name`, `english_name`, `provinceId`, `countryId`, `isCapital`
- **Province fields** follow the same 10-RTE-field schema as City
- **Token expiry:** If auth errors occur, the token may have expired. Ask the user for a new one.
- **Combined payload (>2 RTE fields) → 501.** Send exactly 2 fields per update call.

---

## 9. Query Helper (Python)

Run scripts from the project root. Load `.env` automatically:

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

API_URL = env_vars.get("API_URL", "http://185.239.0.14:1406") + "/lesan"
GHOST_TOKEN = env_vars.get("GHOST_TOKEN")
HEADERS = {"Content-Type": "application/json", "token": GHOST_TOKEN}

def api(payload):
    data = json.dumps(payload, ensure_ascii=False).encode()
    req = urllib.request.Request(API_URL, data=data, headers=HEADERS, method='POST')
    return json.loads(urllib.request.urlopen(req).read())
```

---

## 10. 9-Language Reference

| Code | Language | Code | Language |
|------|----------|------|----------|
| `fa` | فارسی (Persian) | `es` | Español (Spanish) |
| `en` | English | `nl` | Nederlands (Dutch) |
| `ar` | العربية (Arabic) | `tr` | Türkçe (Turkish) |
| `zh` | 中文 (Chinese) | `ru` | Русский (Russian) |
| `pt` | Português (Portuguese) | | |
