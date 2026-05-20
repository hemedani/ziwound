# Frontend Update Prompt: Sync Location Models with Backend Changes (Photo, Area/Center Removal)

## Context
The backend location models (`country`, `province`, `city`) have been updated with two major changes:
1. **Added `photo` relation** - One-directional single File relation to all three models
2. **Removed `area` and `center` fields** - GeoJSON fields removed from all three models

Additionally, `country` now has an `updateRelations` endpoint (previously didn't exist).

The frontend must be synced to match these changes.

---

## Backend Changes Summary

### 1. Photo Relation Added (One-Directional)

All three models now have a `photo` relation:

```typescript
// In country_relations, province_relations, city_relations:
photo: {
  schemaName: "file",
  type: "single" as RelationDataType,
  optional: true,
  excludes: file_excludes,
  relatedRelations: {},
}
```

**API Method Changes:**

| Model | Method | Change |
|-------|--------|--------|
| `country` | `add` | Added optional `photoId` parameter |
| `country` | `updateRelations` | **NEW endpoint** - handles `photo` relation |
| `province` | `add` | Added optional `photoId` parameter |
| `province` | `updateRelations` | Added `photo` parameter |
| `city` | `add` | Added optional `photoId` parameter |
| `city` | `updateRelations` | Added `photo` parameter |

### 2. Area and Center Fields Removed

The `area` (GeoJSON MultiPolygon/Polygon) and `center` (GeoJSON Point) fields have been **completely removed** from:
- `country_pure`
- `province_pure`
- `city_pure`

**API Method Changes:**

| Model | Method | Change |
|-------|--------|--------|
| `country` | `update` | Removed `area` and `center` from validator and function |
| `province` | `update` | Removed `area` and `center` from validator and function |
| `city` | `update` | Removed `area`, `center`, and `countryId` from validator and function (country relation belongs in `updateRelations`) |

### 3. Country UpdateRelations (New)

The `country` model previously had no `updateRelations` endpoint. It now exists:
- **Endpoint:** `country.updateRelations`
- **Parameters:** `{ _id, photo }` (all optional except `_id`)

---

## Required Frontend Updates

### Priority 1: Regenerate Type Declarations

Run the backend type generation to update `ReqType`:
```bash
# In backend directory
deno task gen-types  # or equivalent command
```
Then copy updated declarations to `front/src/types/declarations.ts`.

### Priority 2: Update Server Actions

#### Country Actions

**`src/app/actions/country/add.ts`**
- Add `photoId?: string` to the `set` parameter type
- Example usage:
  ```ts
  await add({ name: "...", english_name: "...", photoId: "file-id" }, { _id: 1, name: 1, photo: { _id: 1, name: 1 } });
  ```

**`src/app/actions/country/update.ts`**
- Remove `area` and `center` from the `set` parameter type
- These fields should no longer be accepted or sent

**`src/app/actions/country/updateRelations.ts`** (CREATE NEW)
- Create this file if it doesn't exist
- Follow the standard pattern:
  ```ts
  "use server";
  import { AppApi } from "@/lib/api";
  import { ReqType, DeepPartial } from "@/types/declarations";
  import { cookies } from "next/headers";

  export const updateRelations = async (
    data: ReqType["main"]["country"]["updateRelations"]["set"],
    getSelection?: DeepPartial<ReqType["main"]["country"]["updateRelations"]["get"]>
  ) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "country",
      act: "updateRelations",
      details: {
        set: data,
        get: getSelection || {},
      },
    });

    return result;
  };
  ```

#### Province Actions

**`src/app/actions/province/add.ts`**
- Add `photoId?: string` to the `set` parameter type

**`src/app/actions/province/update.ts`**
- Remove `area` and `center` from the `set` parameter type

**`src/app/actions/province/updateRelations.ts`**
- Add `photo?: string` to the `set` parameter type
- Example: `{ _id: "...", country: "...", photo: "..." }`

#### City Actions

**`src/app/actions/city/add.ts`**
- Add `photoId?: string` to the `set` parameter type

**`src/app/actions/city/update.ts`**
- Remove `area`, `center`, and `countryId` from the `set` parameter type
- Note: `countryId` was incorrectly in `update` - it belongs in `updateRelations`

**`src/app/actions/city/updateRelations.ts`**
- Add `photo?: string` to the `set` parameter type
- Example: `{ _id: "...", province: "...", country: "...", photo: "..." }`

### Priority 3: Update Zod Validation Schemas

Update any Zod schemas used for location forms:

```typescript
// ❌ REMOVE these fields from country/province/city schemas:
area: z.object({ type: z.string(), coordinates: z.any() }).optional(),
center: z.object({ type: z.string(), coordinates: z.any() }).optional(),

// ✅ ADD this field to country/province/city schemas:
photoId: z.string().optional(),
```

### Priority 4: Update Admin Forms

#### Country Admin Form (`/admin/countries/...`)
- **Add Form / Edit Form:**
  - Add `ImagePicker` or `FileUploadField` component for `photo` selection
  - Remove any `area` or `center` map/GeoJSON inputs
  - On submit, pass `photoId` to the `add` or `update` action
  - For updating photo, call `updateRelations` with `{ _id, photo: fileId }`

#### Province Admin Form (`/admin/provinces/...`)
- **Add Form / Edit Form:**
  - Add `ImagePicker` or `FileUploadField` component for `photo` selection
  - Remove any `area` or `center` map/GeoJSON inputs
  - On submit, pass `photoId` to the `add` action
  - For updating photo, call `updateRelations` with `{ _id, photo: fileId }`

#### City Admin Form (`/admin/cities/...`)
- **Add Form / Edit Form:**
  - Add `ImagePicker` or `FileUploadField` component for `photo` selection
  - Remove any `area` or `center` map/GeoJSON inputs
  - Remove `countryId` from the pure fields update form (it should only be in relations update)
  - On submit, pass `photoId` to the `add` action
  - For updating photo, call `updateRelations` with `{ _id, photo: fileId }`

### Priority 5: Update Display Components

Wherever country/province/city data is displayed:

#### Table/List Views
- Add a photo column/thumbnail to admin tables
- Use `next/image` with proxy URL:
  ```tsx
  import Image from "next/image";
  import { getImageUploadUrl } from "@/utils/imageUrl";

  {item.photo && (
    <Image
      src={getImageUploadUrl(item.photo.name, "image")}
      alt={item.name}
      width={48}
      height={48}
      unoptimized
      className="rounded object-cover"
    />
  )}
  ```

#### Detail/Preview Views
- Display the photo prominently (hero image or card header)
- Remove any area/center map displays or GeoJSON data rendering

#### TypeScript Interfaces
Update any custom interfaces:
```typescript
// Before
interface CountryWithRelations extends countrySchema {
  area?: { type: string; coordinates: number[][][] };
  center?: { type: string; coordinates: [number, number] };
}

// After
interface CountryWithRelations extends countrySchema {
  photo?: { _id?: string; name?: string; mimeType?: string; size?: number };
}
```

### Priority 6: Update Translations

Add translation keys for the photo field in ALL language files (`/messages/*.json`):

```json
{
  "location": {
    "photo": "Photo",
    "photo.label": "Location Photo",
    "photo.placeholder": "Select a photo for this location",
    "photo.help": "Upload an image representing this country/province/city"
  }
}
```

Remove or deprecate translation keys for:
- `location.area` / `location.area.label`
- `location.center` / `location.center.label`
- Any map/GeoJSON related labels

### Priority 7: Update Image Upload Flow

For the photo field, follow the standard file upload pattern:

1. User selects/uploads an image via `FileUploadField` or `ImagePicker`
2. File is uploaded, returning a file ID
3. File ID is passed as `photoId` to the `add` action
4. For updating an existing photo, call `updateRelations` with `{ _id, photo: fileId }`

Example in a form:
```tsx
const [photoId, setPhotoId] = useState<string | null>(null);

// On form submit
const handleSubmit = async (data: FormData) => {
  const result = await addCountry({
    name: data.name,
    english_name: data.english_name,
    ...(photoId && { photoId }),
  }, { _id: 1, name: 1, photo: { _id: 1, name: 1 } });
};
```

---

## Files to Check and Update

### Server Actions
- `src/app/actions/country/add.ts`
- `src/app/actions/country/update.ts`
- `src/app/actions/country/updateRelations.ts` (CREATE)
- `src/app/actions/province/add.ts`
- `src/app/actions/province/update.ts`
- `src/app/actions/province/updateRelations.ts`
- `src/app/actions/city/add.ts`
- `src/app/actions/city/update.ts`
- `src/app/actions/city/updateRelations.ts`

### Admin Pages
- `src/app/admin/countries/` (all pages/components)
- `src/app/admin/provinces/` (all pages/components)
- `src/app/admin/cities/` (all pages/components)

### Form Components
- Any country/province/city form components
- Any map/GeoJSON input components (may be removable)

### Display Components
- Country/province/city table cells
- Country/province/city detail cards
- Any location preview components

### Translation Files
- `/messages/fa.json`
- `/messages/en.json`
- `/messages/ar.json`
- `/messages/zh.json`
- `/messages/pt.json`
- `/messages/es.json`
- `/messages/nl.json`
- `/messages/tr.json`
- `/messages/ru.json`

### Type Declarations
- `src/types/declarations.ts` (regenerate from backend)

---

## Important Notes

### Image URL Pattern
Always use `file.name` (NOT `file._id`) when constructing photo URLs:
```tsx
// ✅ CORRECT
<Image src={getImageUploadUrl(country.photo?.name, "image")} alt={country.name} />

// ❌ WRONG
<Image src={getImageUploadUrl(country.photo?._id, "image")} alt={country.name} />
```

### UpdateRelations Pattern
Photo updates should go through `updateRelations`, not `update`:
```tsx
// ✅ CORRECT - Update photo via updateRelations
await updateRelations({ _id: countryId, photo: newPhotoId }, { _id: 1, photo: { _id: 1, name: 1 } });

// ❌ WRONG - Don't try to update photo via update
await update({ _id: countryId, photo: newPhotoId }, { _id: 1 });
```

### City Update - No countryId
The `city.update` endpoint no longer accepts `countryId`. To change a city's country, use `updateRelations`:
```tsx
// ✅ CORRECT - Change country via updateRelations
await updateRelations({ _id: cityId, country: newCountryId }, { _id: 1, country: { _id: 1, name: 1 } });
```

---

## Testing Checklist

- [ ] Regenerated type declarations from backend
- [ ] Country add form accepts and saves photo
- [ ] Country edit form can update photo via updateRelations
- [ ] Country update form no longer has area/center fields
- [ ] Province add form accepts and saves photo
- [ ] Province edit form can update photo via updateRelations
- [ ] Province update form no longer has area/center fields
- [ ] City add form accepts and saves photo
- [ ] City edit form can update photo via updateRelations
- [ ] City update form no longer has area/center/countryId fields
- [ ] Country/province/city tables display photo thumbnails
- [ ] Photos render correctly via image proxy
- [ ] TypeScript compiles without errors
- [ ] `pnpm build:strict` passes
- [ ] All 9 language files have photo translation keys
- [ ] Removed area/center translation keys (or marked deprecated)
