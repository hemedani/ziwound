# United States — Results Summary

> **Last updated:** 2026-06-03
> **Total provinces:** 11 ✅
> **Total cities:** 22 ✅
> **Remaining (to create):** 7 cities

---

## Province Status

| Province | ID | Cities | Fields |
|----------|----|--------|--------|
| California | `6a1f28cf` | 4 ✅ | 10/10 ✅ |
| Texas | `6a1f306f` | 4 ✅ | 10/10 ✅ |
| New York | `6a1f363d` | 1 ✅ | 10/10 ✅ |
| Illinois | `6a1f3980` | 1 ✅ | 10/10 ✅ |
| Virginia | `6a1f3b10` | 2 ✅ | 10/10 ✅ |
| Washington DC | `6a1f3d20` | 0 — | 10/10 ✅ |
| Georgia | `6a1f3dc3` | 2 ✅ | 10/10 ✅ |
| Pennsylvania | `6a1f3fb9` | 2 ✅ | 10/10 ✅ |
| Florida | `6a1f419c` | 2 ✅ | 10/10 ✅ |
| Ohio | `6a1fcae5` | 3 ✅ | 10/10 ✅ |
| Michigan | `6a1fcd84` | 3 ✅ | 10/10 ✅ |

## City Detail

| City | Province | Fields | New? |
|------|----------|--------|------|
| Los Angeles | California | 10/10 ✅ | |
| San Francisco | California | 10/10 ✅ | |
| San Diego | California | 10/10 ✅ | |
| San Jose | California | 10/10 ✅ | |
| Houston | Texas | 10/10 ✅ | |
| Dallas | Texas | 10/10 ✅ | |
| Austin | Texas | 10/10 ✅ | |
| San Antonio | Texas | 10/10 ✅ | ✅ Created `6a20037b` |
| New York City | New York | 10/10 ✅ | |
| Buffalo | New York | 6/10 🔄 | ✅ Created `6a20205ec1b216fc5349f922` |
| Chicago | Illinois | 10/10 ✅ | |
| Richmond | Virginia | 10/10 ✅ | |
| Virginia Beach | Virginia | 10/10 ✅ | |
| Washington DC (prov) | — | 10/10 ✅ | |
| Atlanta | Georgia | 10/10 ✅ | |
| Savannah | Georgia | 10/10 ✅ | |
| Philadelphia | Pennsylvania | 10/10 ✅ | |
| Pittsburgh | Pennsylvania | 10/10 ✅ | |
| Miami | Florida | 10/10 ✅ | |
| Orlando | Florida | 10/10 ✅ | |
| Columbus | Ohio | 10/10 ✅ | |
| Cleveland | Ohio | 10/10 ✅ | |
| Cincinnati | Ohio | 10/10 ✅ | |
| Detroit | Michigan | 10/10 ✅ | |
| Flint | Michigan | 10/10 ✅ | |
| Grand Rapids | Michigan | 10/10 ✅ | |

## Key ObjectIds

| Entity | ObjectId |
|--------|----------|
| USA (country) | `6a1f01ccc1b216fc5349f8fa` |
| California (province) | `6a1f28cfc1b216fc5349f8fb` |
| Texas (province) | `6a1f306fc1b216fc5349f8ff` |
| New York (province) | `6a1f363dc1b216fc5349f903` |
| Illinois (province) | `6a1f3980c1b216fc5349f905` |
| Virginia (province) | `6a1f3b10c1b216fc5349f907` |
| Washington DC (province) | `6a1f3d20c1b216fc5349f90a` |
| Georgia (province) | `6a1f3dc3c1b216fc5349f90b` |
| Pennsylvania (province) | `6a1f3fb9c1b216fc5349f90e` |
| Florida (province) | `6a1f419cc1b216fc5349f911` |
| Ohio (province) | `6a1fcae5c1b216fc5349f914` |
| Michigan (province) | `6a1fcd84c1b216fc5349f918` |
| San Antonio (city) | `6a20037bc1b216fc5349f921` |
| Buffalo (city) | `6a20205ec1b216fc5349f922` |

## HTML Standards Applied

| Field Type | Structure |
|------------|-----------|
| `wars_history` | 1× `<h3>`, 5× `<h4>`, 5× `<p>` narrative |
| `conflict_timeline` | 1× `<h3>`, 10× `<h4>`, 10× `<p>` timeline |
| `casualties_info` | 6× `<h4>` categories with `<ul><li>` data (varies by city: Indigenous Genocide through Modern Mass Shootings) |
| `notable_battles` | 1× `<h3>`, 6× `<h4>` sections (Indigenous Resistance through Modern Racial Violence) |
| `occupation_info` | 1× `<h3>`, 6× `<h4>` sections (Spanish Colonial through Resistance) |
| `destruction_level` | 6× `<h4>` categories with `<ul><li>` (Ecosystems through Urban Policy) |
| `civilian_impact` | 1× `<h3>`, 6× `<h4>` sections (Slavery through Civilian Resilience) |
| `mass_graves_info` | 1× `<h3>`, 6× `<h4>` sections (Battle of Medina through Modern Investigations) |
| `war_crimes_events` | 1× `<h3>`, 6× `<h4>` sections (Indigenous Genocide through Modern Police Violence) |
| `liberation_info` | 1× `<h3>`, 5× `<h4>` sections (Failed Liberation through Modern Liberation) |

All verified: **9 languages × identical tag counts** across every field.

## 💡 Lessons Learned

- `city.add` requires **all** of: `name`, `english_name`, `provinceId`, `countryId`, `isCapital`
- `name` is a **plain string**, NOT a multi-language object
- RTE fields ARE multi-language objects — always send all 9 keys
- `update` replaces the entire field — partial sends erase missing languages
- Province-level fields follow the same 10-field schema as cities
- 501 errors on `city.add` were caused by missing `isCapital` and `countryId`
