# Iran — Hybrid Image Strategy Prompt

## 🔐 System Access

- **Backend URL:** from `.env` (`API_URL`, default `http://185.239.0.14:1406`)
- **Ghost Token:** from `.env` (`GHOST_TOKEN`)
- **Token Header:** `token` (NO "Bearer" prefix)
- **Iran Country ObjectId:** `6a0ed03f67c85d8ba0c217a9`

## 🎯 Target List (11 entities — all need photos)

1. 🔄 Iran (country) `6a0ed03f67c85d8ba0c217a9` — replace
2. 🔄 Tehran (province) `6a0ed3dd67c85d8ba0c217ae` — replace
3. 🔄 Khuzestan (province) `6a0ed54567c85d8ba0c217af` — replace
4. 🔄 Ilam (province) `6a0ed59c67c85d8ba0c217b0` — replace
5. 🔄 Kermanshah (province) `6a0ed61f67c85d8ba0c217b1` — replace
6. 🔄 Bushehr (province) `6a0ed74467c85d8ba0c217b2` — replace
7. ⬜ Khorramshahr (city) `6a0ed9de67c85d8ba0c217b3`
8. ⬜ Abadan (city) `6a0ed9fc67c85d8ba0c217b4`
9. ⬜ Dezful (city) `6a0eda1667c85d8ba0c217b5`
10. ⬜ Shush (city) `6a0eda4c67c85d8ba0c217b6`
11. ⬜ Ahvaz (city) `6a0eda6a67c85d8ba0c217b7`

## 🎨 Hybrid Image Strategy

Wikimedia Commons → Pexels API → Pollinations AI fallback

Use `updateRelations` with `photo` key. The `replace: true` behavior in `addRelation` will automatically replace existing photos.
