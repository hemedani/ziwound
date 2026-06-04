# United States — Results Summary

> **Last updated:** 2026-06-04
> **Total provinces:** 11 ✅ complete + 40 ❌ pending
> **Total cities:** 27 ✅ complete + pending
> **Phase:** 1 complete (11 provinces, 27 cities) → Phase 2: create remaining 40 provinces

---

## Province Status — Phase 1 ✅ Complete

| Province | ID | Cities | Fields |
|----------|----|--------|--------|
| California | `6a1f28cf` | 4 | 10/10 ✅ |
| Texas | `6a1f306f` | 4 | 10/10 ✅ |
| New York | `6a1f363d` | 4 | 10/10 ✅ |
| Illinois | `6a1f3980` | 3 | 10/10 ✅ |
| Virginia | `6a1f3b10` | 3 | 10/10 ✅ |
| Washington DC | `6a1f3d20` | 0 | 10/10 ✅ |
| Georgia | `6a1f3dc3` | 3 | 10/10 ✅ |
| Pennsylvania | `6a1f3fb9` | 3 | 10/10 ✅ |
| Florida | `6a1f419c` | 2 | 10/10 ✅ |
| Ohio | `6a1fcae5` | 3 | 10/10 ✅ |
| Michigan | `6a1fcd84` | 3 | 10/10 ✅ |

## Province Status — Phase 2 🔄 Pending (40 provinces to create)

Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut, Delaware, Hawaii, Idaho, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota, Oklahoma, Oregon, Rhode Island, South Carolina, South Dakota, Tennessee, Utah, Vermont, Washington, West Virginia, Wisconsin, Wyoming

## City Detail — Phase 1 ✅ Complete |

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
| Albany (city) | `6a207a77c1b216fc5349f923` |
| Rochester (city) | `6a208247c1b216fc5349f924` |
| Springfield (city) | `6a210f9dc1b216fc5349f925` |
| Aurora (city) | `6a2115bbc1b216fc5349f926` |
| Arlington (city) | `6a2117c4c1b216fc5349f927` |
| Augusta (city) | `6a211ac1c1b216fc5349f928` |

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
