# Croatia — Data Entry Prompt

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

## API Patterns

### Create Province
```python
api({
    "service": "main", "model": "province", "act": "add",
    "details": {
        "set": {
            "name": "Native name",
            "english_name": "English name",
            "countryId": "6a12a0a084ffe580f176d0ef",
            "isCapital": False
        },
        "get": {"_id": 1, "name": 1}
    }
})
```

### Create City
```python
api({
    "service": "main", "model": "city", "act": "add",
    "details": {
        "set": {
            "name": "City name",
            "english_name": "City name",
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
