# Enhanced Prompt: Implement WarCriminals Pages (Admin + Public)

You are an expert Next.js 16 + Tailwind v4 + shadcn/ui developer working on the Ziwound war crimes documentation frontend.

**Task**: Implement full `WarCriminal` management in the admin panel and a public `[locale]/war-criminals` exploration page. The backend `WarCriminal` model and declarations are already complete.

---

## Context

**Backend Model** (`warCriminal`):
- **Pure fields**: `fullName` (string, required), `aliases` (string[]), `dateOfBirth` (date), `nationality` (string[]), `affiliation` (enum: Military/Paramilitary/Government/Rebel Group/Private Military Company/Political/Other), `rankOrPosition` (string), `knownFor` (localizedWarInfo), `biography` (localizedWarInfo), `description` (localizedWarInfo), `status` (enum: Accused/Indicted/Convicted/At Large/Deceased/Unknown/Sanctioned), `convictionDetails` (localizedWarInfo), `isEntity` (boolean, default false), `createdAt`, `updatedAt`
- **Relations**: `tags` (multiple → tag, with reverse `warCriminals`), `photo` (single → file)
- **Reverse relation (auto-created by Lesan)**: `reports` is embedded on `warCriminal` via `report.ts` owning the `warCriminals` relation
- **No `selected_language`** — i18n handled via `localizedWarInfo` sub-fields (`{ fa, en, ar, zh, pt, es, nl, tr, ru }`)
- **Text index** on `fullName`, `aliases`, and localized sub-fields (en/fa/ar)

**Available backend acts**: `add`, `get`, `gets`, `update`, `updateRelations`, `remove`, `count`

**`gets` filters**: `search`, `status`, `affiliation`, `isEntity`, `tagIds`, `nationality`, `createdAtFrom`, `createdAtTo`, `sortBy`, `sortOrder`, `page`, `limit`, `skip`

**`updateRelations` fields**: `tagIds`, `tagIdsToRemove`, `photoId`

---

## Part 1: Server Actions

Create `src/app/actions/warCriminal/` with standard actions following the existing pattern (`tag/gets.ts`, `country/gets.ts`, etc.):

1. **`add.ts`** — Create a war criminal
2. **`get.ts`** — Get single by `_id`
3. **`gets.ts`** — Get multiple with pagination/filtering
4. **`update.ts`** — Update pure fields
5. **`updateRelations.ts`** — Update relations (tags, photo)
6. **`remove.ts`** — Delete with optional `hardCascade`
7. **`count.ts`** — Count with filters

Each action must:
- Use `"use server"` directive
- Import `AppApi` from `@/lib/api`, `ReqType` and `DeepPartial` from `@/types/declarations`
- Read token from `cookies()` and pass to `AppApi`
- Use proper `ReqType["main"]["warCriminal"]["<act>"]["set"]` typing
- Wrap in `try...catch(error: unknown)` returning `{ success: false, body: { message: ... } }` on failure
- Return the full result object `{ success, body }`

---

## Part 2: Admin Panel (`/admin/war-criminals`)

Follow the exact pattern of `/admin/tags/page.tsx` and `/admin/countries/page.tsx`.

**Route structure**:
```
src/app/admin/war-criminals/
├── page.tsx              # List with search, pagination, add dialog
├── war-criminals-table.tsx  # Table component with actions
├── add-war-criminal-dialog.tsx  # Create form in dialog
├── [id]/
│   ├── page.tsx          # Detail view
│   └── edit/
│       └── page.tsx      # Edit form
```

**Admin list page (`page.tsx`)**:
- Server Component receiving `searchParams: Promise<{ page?, search?, status?, affiliation?, isEntity?, sortBy?, sortOrder? }>`
- Fetch war criminals via `gets` with typed query
- Search bar (full-text), status filter dropdown, affiliation filter dropdown, isEntity toggle
- Table component showing: fullName, aliases (chip list), affiliation (badge), status (colored badge), isEntity (icon), createdAt
- Action column: View, Edit, Delete (with confirmation)
- Pagination (prev/next buttons, URL-driven)
- "Add War Criminal" button opening a dialog

**Add/Edit forms**:
- Use React Hook Form + Zod validation
- Fields: `fullName` (required), `aliases` (comma-separated or chip input), `dateOfBirth` (date picker), `nationality` (text input or multi-select), `affiliation` (select dropdown), `rankOrPosition` (text), `knownFor` (multi-language textarea for en/fa/ar), `biography` (multi-language textarea), `description` (multi-language textarea), `status` (select), `convictionDetails` (multi-language textarea), `isEntity` (checkbox)
- For `localizedWarInfo` fields: use a tabbed interface or language selector to switch between language inputs (en, fa, ar at minimum)
- Photo upload: use existing `FileUploadField` component → upload file → pass `photoId` to `add` or `updateRelations`
- Tags: use `TagSelector` component → pass `tagIds` to `add` or `updateRelations`
- Submit via Server Action, redirect on success, show toast on error

**Detail page (`[id]/page.tsx`)**:
- Fetch full war criminal with relations: `{ _id: 1, fullName: 1, aliases: 1, dateOfBirth: 1, nationality: 1, affiliation: 1, rankOrPosition: 1, knownFor: 1, biography: 1, description: 1, status: 1, convictionDetails: 1, isEntity: 1, photo: { _id: 1, name: 1, mimeType: 1 }, tags: { _id: 1, name: 1, color: 1 }, reports: { _id: 1, title: 1, status: 1, createdAt: 1 } }`
- Display photo (via `/api/image-proxy`), full name, aliases as chips, status badge, affiliation badge
- Show localized fields for current locale (pick the right sub-field from `localizedWarInfo` objects)
- Show linked reports as a table/list with links to `/[locale]/reports/[id]`
- Show linked tags as chips with links to `/war-crimes?tagIds=[id]`
- Edit and Delete buttons

---

## Part 3: Public Page (`/[locale]/war-criminals`)

**Route**: `/(fa|en|ar|zh|pt|es|nl|tr|ru)/war-criminals`

**Structure**:
```
src/app/[locale]/war-criminals/
├── page.tsx              # Main exploration page
├── loading.tsx           # Skeleton loaders
└── error.tsx             # Error boundary
```

**Features**:
- Server Component with `searchParams` and `params: { locale }`
- **Hero header**: Title, description, overline ("Perpetrator Database"), subtle gradient background
- **Filters bar** (URL-driven query params):
  - `search` — full-text search
  - `status` — dropdown (Accused, Indicted, Convicted, At Large, Deceased, Sanctioned)
  - `affiliation` — dropdown (Military, Government, Rebel Group, etc.)
  - `isEntity` — toggle (Individuals vs Organizations)
  - `tagIds` — multi-select tags
  - `nationality` — text search
  - `sortBy` — fullName, status, affiliation, createdAt
  - `sortOrder` — asc/desc
- **Results**: Grid of cards or table (toggle between views)
  - Each card shows: photo (or placeholder avatar/icon), fullName, status badge, affiliation badge, `isEntity` indicator (person icon vs building icon), short `knownFor` text (in current locale), linked tags
  - Clicking a card → detail page
- **Pagination**: URL-driven, prev/next buttons
- **Empty state**: Use `EmptyState` component when no results
- **Loading state**: Use `SkeletonList` / `SkeletonTable`

**Detail sub-route** (`/[locale]/war-criminals/[id]`):
```
src/app/[locale]/war-criminals/[id]/
└── page.tsx
```
- Full profile page with:
  - Hero section with photo, name, status, affiliation, aliases
  - Biography section (localized)
  - Known for section (localized)
  - Conviction details section (localized)
  - Linked reports section (table/cards with links)
  - Linked tags (chips)
  - Breadcrumb navigation
  - Share button (copy URL)

---

## Part 4: Admin Sidebar Integration

Add War Criminals link to `src/components/layout/admin-sidebar.tsx`:
```tsx
{ name: t("warCriminals") || "War Criminals", href: "/admin/war-criminals", icon: Shield },
```
Use the `Shield` icon from `lucide-react` (already imported).

---

## Part 5: Translations

Add translation keys to **ALL** language files in `/messages/` (fa.json, en.json, ar.json, zh.json, pt.json, es.json, nl.json, tr.json, ru.json):

**`admin` namespace**:
- `warCriminals`, `warCriminalsManagement`, `warCriminalsManagementDescription`
- `addWarCriminal`, `editWarCriminal`, `deleteWarCriminal`, `viewWarCriminal`
- `searchWarCriminals`, `fullName`, `aliases`, `dateOfBirth`, `nationality`
- `affiliation`, `rankOrPosition`, `knownFor`, `biography`, `description`
- `status`, `convictionDetails`, `isEntity`, `photo`
- Status values: `Accused`, `Indicted`, `Convicted`, `At Large`, `Deceased`, `Unknown`, `Sanctioned`
- Affiliation values: `Military`, `Paramilitary`, `Government`, `Rebel Group`, `Private Military Company`, `Political`, `Other`

**Public namespace** (e.g., `warCriminals` key):
- `title`, `description`, `overline`
- `searchPlaceholder`, `filterByStatus`, `filterByAffiliation`, `individuals`, `organizations`
- `noResults`, `noResultsDescription`, `viewProfile`, `linkedReports`
- `biography`, `knownFor`, `convictionDetails`, `aliases`
- `shareProfile`, `copyLink`

**CRITICAL**: When using `getTranslations()` in Server Components, ALWAYS pass `locale` explicitly: `await getTranslations({ locale })`.

---

## Part 6: Types

Extend the declarations type if needed:
```tsx
interface WarCriminalWithRelations extends warCriminalSchema {
  photo?: { _id?: string; name?: string; mimeType?: string };
  tags?: Array<{ _id?: string; name?: string; color?: string }>;
  reports?: Array<{ _id?: string; title?: string; status?: string; createdAt?: string }>;
}
```

---

## Key Rules

1. **STRICT**: Use **pnpm** for all package manager commands
2. **STRICT**: Server Actions only for backend communication — no client-side `fetch`
3. **STRICT**: Add translations to **ALL** 9 language files
4. **STRICT**: Never use `any` type — use `ReqType` and declarations
5. Use `getImageUploadUrl()` from `@/utils/imageUrl` for photo display via proxy
6. Use `shadcn/ui` components (Button, Input, Select, Badge, Card, Table, Dialog, Tabs, Skeleton)
7. Forms: React Hook Form + Zod validation
8. RTL/LTR: Use logical properties (`ps-`, `me-`, `start-`, `end-`)
9. Error handling: All Server Actions wrapped in `try...catch`, return `{ success: false, body: { message } }`
10. Loading states: Use `SkeletonTable` / `SkeletonList` / `Skeleton` components
11. Empty states: Use `EmptyState` component
12. For `localizedWarInfo` fields in forms: create a language tab switcher (en/fa/ar minimum)
13. For `localizedWarInfo` display: pick the sub-field matching current locale, fallback to `en`

---

## Implementation Order

1. Server actions (`src/app/actions/warCriminal/`)
2. Admin sidebar link
3. Admin list page + table + add dialog
4. Admin detail + edit pages
5. Public exploration page (`/[locale]/war-criminals`)
6. Public detail page (`/[locale]/war-criminals/[id]`)
7. Translations (all 9 languages)
8. Test in fa (RTL) and en (LTR)

---

## Report Integration Note

When viewing a Report detail page (`/[locale]/reports/[id]`), the `warCriminals` relation is already embedded. Add clickable links from each war criminal to `/[locale]/war-criminals/[id]`. Similarly, when creating/editing a Report in admin, add a `warCriminalIds` multi-select field using the existing `TagSelector` pattern (but fetching war criminals instead of tags).
