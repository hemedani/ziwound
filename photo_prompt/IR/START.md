You are the Autonomous Image Entry Agent for **Iran** (`IR`).

---

## 1. Reading Order

```
photo_prompt/IR/START.md       ← you are here
photo_prompt/IR/CONTINUE.md    ← current position
photo_prompt/IR/TODO.md        ← checklist
photo_prompt/IR/DATA_ENTRY.md  ← Hybrid Strategy, API patterns
```

---

## 2. Pre-Flight Checklist (before EACH microstep)

- [ ] Read `CONTINUE.md` → `TODO.md` — know which entity is next
- [ ] Read `DATA_ENTRY.md` — review Hybrid Strategy, upload flow, updateRelations
- [ ] Load `.env` credentials
- [ ] Query the DB to verify TODO matches reality
- [ ] Execute Hybrid Strategy for exactly **ONE entity** (with image compression via `imagescript`)
- [ ] Update ALL 3 tracking files: `CONTINUE.md`, `TODO.md`, `RESULT.md`
- [ ] **Report summary and ASK "Continue to next microstep?" — WAIT for user. Never auto-advance.**

---

## 3. Country Info

| Property | Value |
|----------|-------|
| Country | Iran |
| Code | IR |
| ObjectId | `6a0ed03f67c85d8ba0c217a9` |
| Folder | `photo_prompt/IR/` |
| API URL | from `.env` `API_URL` |
| Auth | `token` header (NO "Bearer" prefix) from `.env` `GHOST_TOKEN` |

---

## 4. Target List (Processing Order: Country → Provinces → Cities)

### Country — 🔄 Replace existing photo
1. 🔄 🇮🇷 Iran (`6a0ed03f67c85d8ba0c217a9`)

### Provinces — 🔄 Replace all existing photos
2. 🔄 Tehran (`6a0ed3dd67c85d8ba0c217ae`)
3. 🔄 Khuzestan (`6a0ed54567c85d8ba0c217af`)
4. 🔄 Ilam (`6a0ed59c67c85d8ba0c217b0`)
5. 🔄 Kermanshah (`6a0ed61f67c85d8ba0c217b1`)
6. 🔄 Bushehr (`6a0ed74467c85d8ba0c217b2`)

### Cities — ⬜ All need photos (in Khuzestan)
7. ⬜ Khorramshahr (`6a0ed9de67c85d8ba0c217b3`)
8. ⬜ Abadan (`6a0ed9fc67c85d8ba0c217b4`)
9. ⬜ Dezful (`6a0eda1667c85d8ba0c217b5`)
10. ⬜ Shush (`6a0eda4c67c85d8ba0c217b6`)
11. ⬜ Ahvaz (`6a0eda6a67c85d8ba0c217b7`)
