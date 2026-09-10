# ZiWound Regional Manager Feature — Full Implementation Reference

> **Version:** 1.0
> **Audience:** Frontend AI agent (and any contributor touching the regional manager flow)
> **Scope:** Complete documentation of the regional manager feature as implemented across backend + frontend, so future changes (especially in the admin panel) can be built safely.

---

## 1. Feature Overview

A **regional manager** is an authenticated user who is granted management rights over a **single geographical area** — a country, province, or city. Anyone can volunteer by submitting a **regional manager request** (either during registration or later from their dashboard). A Manager reviews the request and can **approve** or **reject** it.

Once approved, the user becomes a regional manager and can:

1. **Manage reports in their area** — approve, reject, or set reports to in-review (a review trail records who reviewed and a note).
2. **Update their own area's information** — e.g. a country manager edits localized war-history fields of their country only.
3. See a **dedicated area dashboard** (`/[locale]/regional`) instead of the global admin panel.

Regional managers keep their normal user level (usually `Ordinary`) — regional management is **not** a new user level. Access control is enforced **server-side** by area-scoped authorization.

### 1.1 Area scope inheritance (downward)

| Managed area | Reports the manager can see/manage | Area info they can edit |
|---|---|---|
| Country | Reports whose `attackedCountries` = that country, **or** `attackedProvinces` = any province of the country, **or** `attackedCities` = any city of the country | The country only |
| Province | Reports whose `attackedProvinces` = that province, **or** `attackedCities` = any city of the province | The province only |
| City | Reports whose `attackedCities` = that city | The city only |

Report→area membership is determined by the report's `attackedCountries` / `attackedProvinces` / `attackedCities` relations (there is **no** GeoJSON polygon fencing).

### 1.2 Rules enforced by design

- **One active area per user.** Approving a new request replaces any previous assignment.
- **Multiple managers per area are allowed** (several approved requests can point at the same area).
- **No hard delete for regional managers.** They can only change status (Approved/Rejected/InReview). Permanent delete remains Manager/Editor-only.
- A regional manager **cannot approve/reject their own reports** is NOT currently enforced (open enhancement).

---

## 2. Backend Reference (source of truth)

> Backend lives in `back/`. All endpoints are exposed through Lesan at `POST /lesan` with body `{ service, model, act, details: { set, get } }`. New endpoints appear in the generated declarations and the playground.

### 2.1 New model: `regionalManagerRequest`

File: `back/models/regionalManagerRequest.ts`

| Field | Type | Notes |
|---|---|---|
| `_id` | string (ObjectId) | |
| `status` | `"Pending" \| "Approved" \| "Rejected"` | default `Pending` |
| `areaType` | `"Country" \| "Province" \| "City"` | required |
| `justification` | string? | applicant's reason |
| `reviewNote` | string? | admin decision note / rejection reason |
| `decidedAt` | Date? | set when decided |
| `createdAt` / `updatedAt` | Date? | |
| `user` | embedded user (relation) | applicant (reverse `regionalManagerRequests` on User) |
| `country` / `province` / `city` | embedded location (relation) | exactly one present, matching `areaType` |
| `reviewedBy` | embedded user (relation) | the Manager who decided |

### 2.2 `regionalManagerRequest` acts

| Act | Auth | `set` | Notes |
|---|---|---|---|
| `add` | any logged-in user | `{ areaType, countryId?, provinceId?, cityId?, justification? }` | Self-apply. Exactly one area id must match `areaType`. Blocks if the user already has a `Pending`/`Approved` request; re-apply allowed after `Rejected`. |
| `get` | owner or Manager | `{ _id }` | |
| `gets` | Manager | `{ page, limit, search?, status?, areaType?, userIds?, createdAtFrom?, createdAtTo?, sortBy?, sortOrder? }` | Returns array of requests. |
| `decide` | Manager | `{ _id, decision: "Approved"\|"Rejected", reviewNote? }` | Approving assigns `isRegionalManager` + the `manages*` relation on the user (replacing previous assignment). Rejecting just records the note. |
| `remove` | Manager | `{ _id, hardCascade? }` | Deleting an `Approved` request **revokes** the assignment (clears `manages*`, sets `isRegionalManager: false`). |
| `count` | Manager | same filters as `gets` | returns `{ qty }` |

### 2.3 User model additions

- `isRegionalManager: boolean` (default `false`) — pure field.
- Relations `managesCountry`, `managesProvince`, `managesCity` (single, optional) — each embeds the location and creates a reverse `regionalManagers` array on the location model.
- Reverse relation `regionalManagerRequests` (multiple) auto-created on User by the request model.
- These are **not** settable via `user.addUser` / `updateUser` / `updateUserRelations` — only through `regionalManagerRequest.decide` / `remove`.

### 2.4 Report model additions

- Pure fields: `reviewNote` (string?), `reviewedAt` (Date?).
- Relation: `reviewedBy` (single, optional User → reverse `reviewedReports` on User).

| New act | Auth | `set` | Notes |
|---|---|---|---|
| `report.updateStatus` | any logged-in user (fn enforces scope) | `{ _id, status, reviewNote? }` | Admin (Ghost/Manager/Editor) → any report. Regional manager → only reports in their area. Sets `status` + `reviewedBy` + `reviewedAt` + `reviewNote`. |
| `report.getsMyArea` | any logged-in user (fn enforces scope) | `{ page, limit, status?, search?, sortBy?, sortOrder? }` | Admin → all reports. Regional manager → only in-area reports (inherits down the hierarchy). |

### 2.5 Location model authorization change

`country` / `province` / `city` `update` and `updateRelations` previously required `level: Manager`. Their `preAct` is now just `[setTokens, setUser]`, and the real authorization is inside the function:

```
assertAreaAccess(user, areaType, targetId)
```

which allows **Ghost/Manager/Editor** (admins) OR the **regional manager whose managed area matches `_id`**. Everyone else gets an error. **This means the existing admin CRUD still works unchanged** while regional managers can now edit only their own area.

> ⚠️ `assertAreaAccess` compares the `_id` in `set` against the manager's assignment — it is exact-match, so a country manager cannot edit a province under their country.

### 2.6 Registration changes

`user.registerUser` (public) now accepts extra optional fields:

- Profile: `gender` (required), `birth_date`, `address`, `bio` (localized object `{ fa, en, ar, zh, pt, es, nl, tr, ru }`), `avatarId` (file id).
- Regional application: `regionalAreaType` (`Country|Province|City`), `regionalCountryId`, `regionalProvinceId`, `regionalCityId`, `regionalJustification`.

If the regional fields are present, the backend validates exactly one area and automatically creates a `regionalManagerRequest` with status `Pending` linked to the new user.

---

## 3. Frontend Implementation Reference

### 3.1 Server actions (already implemented)

All under `src/app/actions/`:

| Action file | Calls |
|---|---|
| `regionalManagerRequest/add.ts` | `regionalManagerRequest.add` |
| `regionalManagerRequest/get.ts` | `regionalManagerRequest.get` |
| `regionalManagerRequest/gets.ts` | `regionalManagerRequest.gets` |
| `regionalManagerRequest/decide.ts` | `regionalManagerRequest.decide` |
| `regionalManagerRequest/remove.ts` | `regionalManagerRequest.remove` |
| `regionalManagerRequest/count.ts` | `regionalManagerRequest.count` |
| `report/updateStatus.ts` | `report.updateStatus` |
| `report/getsMyArea.ts` | `report.getsMyArea` |
| `user/registerUser.ts` | already updated — passes the new fields through |

The location scoped updates reuse the existing `country/update.ts`, `province/update.ts`, `city/update.ts` (and their `updateRelations`) — no new actions needed there; the backend handles scope.

### 3.2 Pages & components (already implemented)

| Route / component | File | Purpose |
|---|---|---|
| Register page | `src/app/[locale]/(auth)/register/page.tsx` | Full profile fields + collapsible "Apply to become a regional manager" section (area type + cascading country→province→city selects + justification). |
| Regional dashboard | `src/app/[locale]/(dashboard)/regional/page.tsx` | Branches on request/assignment state: application form, pending card, rejected card (+ reason + re-apply), or management dashboard. |
| Apply form (reusable) | `src/components/regional/regional-apply-form.tsx` | Self-contained application form used by the dashboard (and reusable on other pages). |
| Area info editor | `src/components/regional/area-info-form.tsx` | Localized (9-language tabs) editor for a managed area's war-history fields + name/english_name. |
| Admin requests page | `src/app/admin/regional-requests/page.tsx` | Server page: list + filter (status/areaType/search) of all requests. |
| Admin requests client | `src/app/admin/regional-requests/_components/regional-requests-client.tsx` | Approve/reject (with optional note dialog) and revoke actions. |

### 3.3 Auth store, navigation, i18n

- `src/stores/authStore.ts` — `User` now includes `isRegionalManager?: boolean`.
- `src/components/layout/header.tsx` — user dropdown shows **"My Area"** (`/{locale}/regional`) when `isRegionalManager`; admin mobile menu has a "Regional Manager Requests" link.
- `src/components/layout/admin-sidebar.tsx` — "Regional Manager Requests" nav item under **system** (requires level ≥ Manager).
- i18n: new top-level namespace `regional` added to **all 9 locale files** in `messages/*.json`, plus new keys in `auth` (`gender`, `gender_Male`, `gender_Female`, `birthDate`, `address`), `admin` (regional request/status/area labels, `empty`), `header` (`regionalManager`), `myReports` (`reviewNote`).
- Types: `src/types/declarations.ts` is regenerated from the backend (`back/declarations/selectInp.ts`) and contains `regionalManagerRequestSchema`, the new `regionalManagerRequest` acts, `report.updateStatus`, `report.getsMyArea`, and the new user fields.

### 3.4 How to fetch the current user's own request

The admin-gated `gets` can't be used by a normal user. Instead:

1. `getMe` with projection `regionalManagerRequests: { _id: 1, status: 1 }` → get the latest request `_id`.
2. `regionalManagerRequest.get({ _id })` (owner-authorized) with a full projection → status, areaType, justification, reviewNote, decidedAt, and the embedded area.

To show the assigned area of an approved manager, project the user's `managesCountry` / `managesProvince` / `managesCity` via `getMe` (each embeds `_id` + `name`).

### 3.5 Response shape notes (gotchas)

- `regionalManagerRequest.gets` returns a **plain array** as the body (not `{ list: [...] }`). Some other models wrap in `{ list }` — always handle both.
- `report.getsMyArea` also returns a plain array body.
- Embedded `regionalManagerRequests` on the user only exposes `_id` + `status` (other fields are excluded by the model `excludes`), so always call `get` for full details.
- `birth_date` must be sent as an ISO string; the backend type is `Date` so cast when building the payload (`data.birth_date as unknown as Date`).

---

## 4. Admin Panel — What Exists & What's Next

### 4.1 Already implemented

- `/admin/regional-requests` — review queue: list all requests (filterable), approve/reject with an optional review note, revoke active managers.
- Admin users list (`/admin/users`) currently does **not** show regional-manager status or managed area (open work).

### 4.2 Planned admin enhancements for regional users

The next iteration should make **active regional managers** visible and manageable from the admin panel. Suggested scope:

1. **Users table**: add columns/badges for `isRegionalManager` + managed area (derive from `getMe`-style projections in `getUsers`).
2. **Regional managers view** (either a new tab on `/admin/regional-requests` or a dedicated `/admin/regional-managers` page):
   - List all **Approved** requests (active managers).
   - Show applicant, area type, area name, since when (`decidedAt`), and the manager's user level.
   - **Revoke** access directly (calls `regionalManagerRequest.remove` with revoke semantics) with a confirmation dialog.
3. **Per-area grouping** — group active managers by country/province/city so admins can see who manages what.
4. Optionally surface `reviewedBy` and `reviewNote` on each request card.

> When building these, respect the i18n pattern (`admin` namespace keys in all 9 locales), the existing admin glass/table styling, and the `DeepPartial<ReqType[...]["get"]>` typed-projection pattern used across admin pages.

---

## 5. Useful Type Snippets

```ts
import type { DeepPartial, regionalManagerRequestSchema, reportSchema } from "@/types/declarations";

type RequestItem = DeepPartial<regionalManagerRequestSchema> & {
  country?: { _id: string; name?: string };
  province?: { _id: string; name?: string };
  city?: { _id: string; name?: string };
};

// Projection for admin requests list
{
  _id: 1, status: 1, areaType: 1, justification: 1, reviewNote: 1,
  decidedAt: 1, createdAt: 1,
  user: { _id: 1, first_name: 1, last_name: 1, email: 1 },
  country: { _id: 1, name: 1 },
  province: { _id: 1, name: 1 },
  city: { _id: 1, name: 1 },
}

// Projection for getMe (own request + assignment)
{
  _id: 1, isRegionalManager: 1,
  managesCountry: { _id: 1, name: 1 },
  managesProvince: { _id: 1, name: 1 },
  managesCity: { _id: 1, name: 1 },
  regionalManagerRequests: { _id: 1, status: 1 },
}
```

---

## 6. Environment & Verification

- Backend: `cd back && deno task bc-dev` → playground at `http://localhost:1406/playground`.
- Frontend: `cd front && pnpm dev`.
- Regenerate types after any backend change: start the backend once (writes `back/declarations/selectInp.ts`), then copy it to `front/src/types/declarations.ts`.
- Quick E2E: register with a regional application → approve in `/admin/regional-requests` → log in as the approved user → open `/{locale}/regional` and manage in-area reports + edit area info.
