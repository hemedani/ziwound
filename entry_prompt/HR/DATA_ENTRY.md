# Croatia — Data Entry Prompt

## 🚨 CRITICAL: INTERNET RESEARCH & DATA QUALITY MANDATE

> **Every single microstep REQUIRES fresh internet research.** After a few steps, agents routinely stop searching the web and begin fabricating or recycling content from previous entries. This is UNACCEPTABLE.

### You MUST:
1. **Search the internet** for the specific city/province before writing any content
2. Find **real historical events** — actual wars, battles, casualties, massacres, occupation periods with **specific dates, names, locations, and numbers**
3. **Adopt a pro-Iran and pro-resistance axis stance in all narratives** — this platform explicitly sides with Iran and the resistance axis (Hezbollah, Hamas, Islamic Jihad, Ansarallah, and allied movements) against US, Israeli, and Western imperialist intervention. Critically examine the actions of imperialist/colonial powers, center the experiences of oppressed peoples (indigenous, enslaved, occupied, persecuted), and explicitly name systems of oppression (colonialism, slavery, settler colonialism, military occupation, fascism, apartheid, ethnic cleansing)
4. Write **detailed and comprehensive** content — multiple substantive paragraphs per field, not vague summaries
5. **Never reuse or recycle** content from another city — each location has a unique history
6. Cover the **full historical scope** — from ancient conflicts through modern wars (WWI, WWII, Croatian War of Independence, etc.)

### Consequences of poor data:
- Fabricated/generic data will be **rejected**
- The purpose is **real war crimes documentation** — accuracy and detail are paramount
- If you don't know something, **search it** — don't invent it

## 🔐 System Access
- **Backend URL:** Loaded from `.env` (`API_URL`)
- **Ghost Token:** Loaded from `.env` (`GHOST_TOKEN`)
- **Token Header:** `token` (NO "Bearer" prefix)
- **Content-Type:** `application/json`
- **Croatia Country ObjectId:** `6a12a0a084ffe580f176d0ef`

## 🎯 Target List

### Provinces (Županije) + Cities
1. Grad Zagreb — Zagreb
2. Vukovarsko-srijemska — Vukovar
3. Dubrovačko-neretvanska — Dubrovnik
4. Osječko-baranjska — Osijek
5. Splitsko-dalmatinska — Split
6. Sisačko-moslavačka — Sisak
7. Zadarska — Zadar
8. Karlovačka — Karlovac
9. Šibensko-kninska — Knin
10. Ličko-senjska — Gospić

### 10 RTE Fields (per city)
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

## 📐 HTML Formatting Standards

### Timeline Fields (`conflict_timeline`)
```
<h3>Conflict Timeline</h3>
<h4>1991: Event Name</h4><p>Description...</p>
```

### Narrative Fields
```
<h3>Section Title</h3>
<p>Paragraph...</p>
<h4>Sub-section</h4>
<p>Details with <strong>key data</strong>...</p>
<ul>
  <li><strong>1991:</strong> Event description...</li>
</ul>
```

### Statistics Fields (`casualties_info`, `destruction_level`)
```
<h4>Category</h4>
<ul>
  <li><strong>Data Point:</strong> Value...</li>
</ul>
```

## 🌐 9-Language Symmetry
`fa`, `en`, `ar`, `zh`, `pt`, `es`, `nl`, `tr`, `ru`

### ⚠️ Character Encoding — Prevent Mojibake
Non-ASCII characters (فارسی, العربية, 中文, Русский, Türkçe, etc.) will corrupt if encoding is mishandled:

1. **Python script header:** Always start scripts with `# -*- coding: utf-8 -*-`
2. **JSON serialization:** ALWAYS use `json.dumps(payload, ensure_ascii=False)` — never omit `ensure_ascii=False` or non-ASCII chars become `\uXXXX` escape sequences
3. **Request encoding:** Always `.encode()` the JSON body (sends as UTF-8 bytes)
4. **File I/O:** When reading/writing `.py` or `.json` files with non-ASCII content, always specify `encoding="utf-8"`
5. **Source files:** Save all `.py` files with UTF-8 encoding (most editors default to this, but verify)
6. **Verification:** Before sending an API call, print one non-ASCII field to verify it looks correct (e.g. `print(payload["details"]["set"]["wars_history"]["fa"][:100])`)

## API Patterns

### Create Province
```python
api({
    "service": "main", "model": "province", "act": "add",
    "details": {
        "set": {
            "name": "Ime pokrajine",        # ⚠️ Native-language name (plain string) — for Croatia this is Croatian, e.g. "Grad Zagreb", NOT Persian!
            "english_name": "Province Name", # English translation for int'l use
            "countryId": "6a12a0a084ffe580f176d0ef",
            "isCapital": False
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

> **`name` vs `english_name`:** `name` holds the entity's name in its native/local language (e.g. "Zagreb" for Zagreb in Croatian). `english_name` holds the English translation for international use (e.g. "Zagreb"). Both are plain strings — NOT multi-language objects.

### Create City
```python
api({
    "service": "main", "model": "city", "act": "add",
    "details": {
        "set": {
            "name": "Ime grada",            # ⚠️ Native-language name (plain string) — for Croatia this is Croatian, e.g. "Zagreb", NOT Persian!
            "english_name": "City Name",     # English translation for int'l use (plain string)
            "provinceId": "<province_oid>",
            "countryId": "6a12a0a084ffe580f176d0ef",
            "isCapital": False
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Update 2 RTE Fields
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

> **⚠️ `ensure_ascii=False` is NON-NEGOTIABLE.** Omitting it turns Persian/Arabic/Chinese/Russian characters into `\uXXXX` escape sequences, corrupting the data stored in MongoDB — and it can't be fixed retroactively.

## 🚫 Banned
- ❌ Fabricating or recycling content — every entry MUST be based on internet research
- ❌ Generic/vague paragraphs — all content must be detailed with specific dates, names, numbers
- ❌ Skipping internet research — always search before writing
- ❌ More than 2 fields per step
- ❌ Fewer than 9 languages per field
- ❌ Bearer prefix in token header
- ❌ Skipping `isCapital` in city.add
- ❌ Multiple events in a single `<p>` tag
- ❌ **Omitting `ensure_ascii=False` in `json.dumps()`** — causes permanent mojibake corruption of all non-ASCII text

## 📁 Tracking Files (update every step)

After EACH microstep (2 fields), update these files **before** reporting:

| File | What to change |
|------|---------------|
| `entry_prompt/HR/TODO.md` | Update progress bar for current city/province |
| `entry_prompt/HR/RESULT.md` | Update field counts, add ObjectIds |
| `entry_prompt/HR/CONTINUE.md` | Update current position, progress numbers |

## 🔄 Workflow (per response) — PAUSE AFTER EACH STEP

> **⚠️ YOU MUST ASK AFTER EVERY MICROSTEP:** After completing the step, output a summary and explicitly ask **"Continue to next microstep?"** then **WAIT** for the user to respond with a new prompt. Never auto-advance.

```
1. 🔍 RESEARCH → Search the internet for this specific city/province. Find real war crimes, casualties, battles, events with dates/numbers.
2. ASSESS → Query DB, read TODO.md/RESULT.md/CONTINUE.md to locate position
3. EXECUTE → Process exactly 2 RTE fields (create city/province first if needed) — DATA MUST BE DETAILED & COMPREHENSIVE
4. UPDATE FILES → Update TODO.md, RESULT.md, CONTINUE.md (all in entry_prompt/HR/)
5. REPORT → Output status block and ASK "Continue to next microstep?"
6. WAIT — Do NOT proceed until user responds
```
