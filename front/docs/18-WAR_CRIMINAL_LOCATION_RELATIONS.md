# War Criminal ↔ Location Relations (Birthplace & Residence) — Frontend Reference

> **Version:** 1.0
> **Audience:** Frontend AI agent (and any contributor touching war-criminal creation/editing/detail pages)
> **Scope:** Documents the new backend relations added to `warCriminal` for **place of birth** and **place of residence**, so the frontend can collect, persist, display, and filter these fields safely.
> **Related docs:** `17-REGIONAL_MANAGER_FEATURE.md` (backend reference style), `03-REPORT_MODULE_FULL_DOCS.md` (report relations, incl. `warCriminals` link).

---

## 1. What changed & why

War criminals used to have **no direct link** to any location model. Crime *areas* are intentionally **not** being linked directly — they are already derivable through the existing chain:

```
report.warCriminals  →  (criminal)
report.attackedCountries / attackedProvinces / attackedCities  →  (where their crimes happened)
```

Adding duplicate location relations for crime areas would create data redundancy, so the backend only added two **biographical** place relations:

1. **Place of birth** (`birthCountry` **or** `birthCity`)
2. **Place of residence** (`residenceCountry` **or** `residenceCity`)

### 1.1 Rules enforced by the backend

- A "place" is stored at **one granularity only**: either a **Country** OR a **City** (never both, never a raw Province).
- City is preferred when the specific city is known; Country is used when only the country level is documented.
- For entities (e.g. Wagner Group, `isEntity: true`) or unknowns, both can be left empty.
- These are **single** relations — a criminal has at most one birthplace and one (current/last) residence.
- **No reverse relations** were created on Country/City. Location pages do **not** get a "criminals born/living here" list, so nothing changes on location pages or their APIs.
- The existing free-text `nationality: string[]` field is **unchanged and still present** — do not treat these relations as a replacement for it.

> This change is purely additive. Existing reports, war-criminal records, and server actions keep working.

---

## 2. Backend Reference (source of truth)

> Backend lives in `back/`. All endpoints are exposed through Lesan at `POST /lesan` with body `{ service, model, act, details: { set, get } }`. After a backend restart, new fields appear in `back/declarations/selectInp.ts` and the playground at `http://localhost:1406/playground`.

### 2.1 New relations on `warCriminal` (`back/models/warCriminal.ts`)

All four are `type: "single"`, `optional`, embed location pure fields (heavy localized war-history text is excluded via `location_excludes`), and have **no** `relatedRelations` (no reverse list on the location).

| Relation | Target model | Meaning | Embedded fields exposed |
|---|---|---|---|
| `birthCountry` | `country` | birthplace at country granularity | `_id`, `name`, `english_name` (+ a few non-history country text fields) |
| `birthCity` | `city` | birthplace at city granularity | `_id`, `name`, `english_name` |
| `residenceCountry` | `country` | residence at country granularity | `_id`, `name`, `english_name` (+ a few non-history country text fields) |
| `residenceCity` | `city` | residence at city granularity | `_id`, `name`, `english_name` |

> ⚠️ **The embedded location is lean.** `birthCity` embeds only `{ _id, name, english_name }` — it does **not** embed the city's `province` or `country`. If you need the parent province/country of a stored city (e.g. to display "Aleppo, Syria"), fetch it separately with `city.get` (which exposes its own province/country relations), or resolve it from a location list you already have. See §3.4.

### 2.2 `warCriminal.add` — new `set` fields

Auth: **Manager/Editor**. All new fields optional.

| Param | Type | Notes |
|---|---|---|
| `birthCountryId` | string (ObjectId) | mutually exclusive with `birthCityId` |
| `birthCityId` | string (ObjectId) | mutually exclusive with `birthCountryId` |
| `residenceCountryId` | string (ObjectId) | mutually exclusive with `residenceCityId` |
| `residenceCityId` | string (ObjectId) | mutually exclusive with `residenceCountryId` |

Sending a country **and** a city id for the same place is rejected with a clear error (`Provide either birthCountryId or birthCityId, not both` — same for residence).

### 2.3 `warCriminal.updateRelations` — new `set` fields

Auth: **Manager/Editor**.

| Param | Type | Behaviour |
|---|---|---|
| `birthCountryId` | ObjectId? | (Re)sets birthplace to that country; **automatically removes** an existing `birthCity` first. |
| `birthCityId` | ObjectId? | (Re)sets birthplace to that city; **automatically removes** an existing `birthCountry` first. |
| `removeBirth` | boolean | Clears the current birthplace entirely (whichever of country/city is set). |
| `residenceCountryId` | ObjectId? | Same as above for residence. |
| `residenceCityId` | ObjectId? | Same as above for residence. |
| `removeResidence` | boolean | Clears the current residence entirely. |

Notes:
- The **exclusivity is handled server-side** — when you switch a place from city → country (or vice-versa), the stale sibling relation is removed for you. The frontend does **not** need to send two requests or pre-read the record.
- `removeBirth` / `removeResidence` are for clearing a place that previously had a value (you cannot "null" it by sending an empty id).
- The existing params `tagIds`, `tagIdsToRemove`, `photoId` are unchanged and can be combined in the same call.
- If you send both a country and city id for the same place in one call, the backend rejects it.

### 2.4 `warCriminal.gets` — new filter params

Public endpoint (no auth). All new params are optional ObjectIds.

| Param | Filters records where |
|---|---|
| `birthCountryId` | `birthCountry._id` matches |
| `birthCityId` | `birthCity._id` matches |
| `residenceCountryId` | `residenceCountry._id` matches |
| `residenceCityId` | `residenceCity._id` matches |

Useful for e.g. "all war criminals born in country X" on a country/city page, or an admin filter.

---

## 3. Frontend Integration Guide

### 3.0 Sync the type declarations FIRST

The backend generated its declarations at `back/declarations/selectInp.ts`. `front/src/types/declarations.ts` is a **manual copy** and does **not** include these new fields yet.

1. Start/restart the backend once (`cd back && deno task bc-dev`) so `back/declarations/selectInp.ts` is regenerated (a running dev server does this automatically on reload).
2. Copy `back/declarations/selectInp.ts` → `front/src/types/declarations.ts`.
3. Verify the types changed by searching for `birthCountry` / `residenceCity` in the copied file.

### 3.1 What appears in the regenerated types

In `ReqType["main"]["warCriminal"]`:

- `add.set` gains `birthCountryId?`, `birthCityId?`, `residenceCountryId?`, `residenceCityId?` (all `string`, i.e. ObjectId).
- `updateRelations.set` gains those four plus `removeBirth?: boolean`, `removeResidence?: boolean`.
- `gets.set` gains the four filter ids.
- `warCriminalSchema` / `warCriminalInp` gain the four optional embedded relations:

```ts
// In warCriminalSchema (projection values omitted for brevity)
birthCountry?: {
  _id?: string;
  name: string;
  english_name: string;
  // ...a few other non-history country fields
};
birthCity?: {
  _id?: string;
  name: string;
  english_name: string;
};
residenceCountry?: { /* same shape as birthCountry */ };
residenceCity?: { /* same shape as birthCity */ };
```

### 3.2 Collecting the data (forms)

Wherever war criminals are created/edited (admin `new`/`edit` forms via `src/app/actions/warCriminal/add.ts` and `updateRelations.ts`), add two optional location selectors:

- **Place of birth**
- **Place of residence**

Each selector should offer **either** a Country pick **or** a City pick (recommended UI: a small granularity toggle "Country / City", then a searchable picker; a cascading city picker that requires a chosen country is fine too). Both empty = unknown/entity.

Suggested form value shape (match the API 1:1):

```ts
type WarCriminalPlace =
  | { countryId?: string; cityId: never }   // country level
  | { countryId: never; cityId?: string }   // city level
  | {};                                     // unset

// Payload for add
{
  // ...other warCriminal fields
  birthCountryId: birthPlace.countryId,
  birthCityId: birthPlace.cityId,
  residenceCountryId: residencePlace.countryId,
  residenceCityId: residencePlace.cityId,
}
```

- **On create**: pass the ids in `add`.
- **On edit**: use `updateRelations`; send only the fields the user changed. When the user switches a place from city to country (or vice-versa), you can send just the new id — the backend removes the old sibling. When the user clears a place that was previously set, send `removeBirth: true` / `removeResidence: true` (and omit the `*Id` params for that place).
- Reuse existing location fetching helpers/components already used by the report forms (country/city `gets`), so pickers show localized `name` while sending `_id`.

### 3.3 Displaying the data (detail pages)

Fetch `warCriminal.get` / `gets` with a projection that includes the relations:

```ts
const wcGet = {
  ...,
  birthCountry: { _id: 1, name: 1 },
  birthCity: { _id: 1, name: 1 },
  residenceCountry: { _id: 1, name: 1 },
  residenceCity: { _id: 1, name: 1 },
};
```

Render logic per place (birth / residence):

```ts
const place = wc.birthCity?.name || wc.birthCountry?.name; // undefined => "Unknown / entity"
```

### 3.4 Showing city → province/country context

Because embedded city relations are lean (`{ _id, name, english_name }`), a display like **"Born in Aleppo, Syria"** needs the city's parent. Two options:

1. **If the picker already has the hierarchy** (user picked Country then City), store the chosen country name/id in your component state and render it — but note the **source of truth on the record is only the city**; re-fetching must not rely on stale UI state.
2. **Resolve from the DB**: call `city.get({ _id: wc.birthCity._id })` and project `province` / `country`. Then render `city.name + ", " + (country.name || province.name)`.

Option 2 is authoritative and recommended for detail pages.

### 3.5 Filtering lists by place

For "criminals born in this country/city" (e.g. linking from a location page or an admin filter), call `warCriminal.gets` with e.g.:

```ts
{
  ...pagination,
  birthCountryId: countryId,   // or birthCityId: cityId
}
```

A country-level filter (`birthCountryId`) will **not** match records stored at city granularity inside that country (the backend matches the embedded relation directly, with no hierarchy expansion). If you need "country X **and everything under it**", query with the country filter **or** resolve the country's cities and also pass their ids — the frontend must combine results.

### 3.6 i18n & UX notes

- Follow the existing pattern when adding labels: add keys to **all 9 locale files** in `messages/*.json` (namespaces already used by war criminals: `admin`, `warCriminals`, etc.).
- Suggested labels: "Place of birth" / "Place of residence", granularity toggle "Country / City", empty-state text for entities/unknowns.
- `warCriminalSchema` still has `nationality?: string[]` — keep any existing nationality UI; it is independent of these new relations.

---

## 4. Verification checklist

- [ ] `back/declarations/selectInp.ts` regenerated, then copied to `front/src/types/declarations.ts` (grep for `birthCountry`).
- [ ] Create a criminal with only `birthCountryId` → detail shows country-level birthplace.
- [ ] Create a criminal with only `birthCityId` → detail shows city birthplace (resolve parent country via `city.get` if needed).
- [ ] `updateRelations`: switch a birthplace city → country and confirm the old city relation is gone (fetch record after).
- [ ] `updateRelations`: send `removeBirth: true` and confirm both birthplace relations clear.
- [ ] Sending both `birthCountryId` + `birthCityId` returns the expected error.
- [ ] `gets` with `birthCountryId` returns the expected subset.

---

## 5. Backend files touched (for reference)

- `back/models/warCriminal.ts` — added `birthCountry`, `birthCity`, `residenceCountry`, `residenceCity` relations.
- `back/src/warCriminal/add/` — accept the four `*Id` params + exclusivity validation.
- `back/src/warCriminal/updateRelations/` — set/replace/clear the four relations; auto-removes the sibling when granularity switches; `removeBirth`/`removeResidence` flags.
- `back/src/warCriminal/gets/` — four new optional location filters.
- `back/declarations/selectInp.ts` — regenerated type declarations.

No changes were made to `models/country.ts`, `models/province.ts`, `models/city.ts`, or to any report/location endpoint.
