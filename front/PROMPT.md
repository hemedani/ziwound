# Frontend Update Prompt: Sync User Methods with Backend Changes

## Context
The backend user model (`models/user.ts`) and user methods (`src/user/addUser/`, `src/user/updateUser/`, `src/user/register/`) have been updated. The frontend must be synced to match these changes.

## Backend Changes Summary

### User Model (`user_pure`) - Field Changes

**Removed fields:**
- `father_name` (was optional, now removed)
- `mobile` (was pattern-validated, now commented out)
- `national_number` (was national number validation, now commented out)

**New fields added:**
- `bio` - `optional(localizedWarInfo)` - Localized biography object with keys: `fa`, `en`, `ar`, `zh`, `pt`, `es`, `nl`, `tr`, `ru` (all optional strings)
- `expertise` - `optional(array(string()))` - Array of expertise strings
- `verified` - `defaulted(boolean(), false)` - Verification status flag
- `verificationBadge` - `optional(string())` - Badge identifier string
- `isPublic` - `defaulted(boolean(), true)` - Profile visibility flag

**Existing fields (unchanged but important):**
- `first_name` (required)
- `last_name` (required)
- `gender` (required: "Male" | "Female")
- `birth_date` (optional, stored as Date, sent as ISO string)
- `summary` (optional)
- `address` (optional)
- `level` (defaulted: "Ghost" | "Manager" | "Editor" | "Reporter" | "Artist" | "Diplomat" | "Researcher" | "Ordinary")
- `email` (required, unique)
- `password` (required, hashed on backend)
- `is_verified` (defaulted: false)
- `createdAt`, `updatedAt` (auto-managed)

**Relations (unchanged):**
- `avatar` (single File relation)
- `national_card` (single File relation)
- `province` (single Province relation)
- `city` (single City relation)

### API Method Changes

#### `user.addUser`
- **Removed from set:** `father_name`, `mobile`, `national_number`
- **Added to set:** `email` (required), `password` (required), `bio`, `expertise`, `verified`, `verificationBadge`, `isPublic`
- **Changed:** `birth_date` now accepts ISO string (backend converts to Date)
- **Changed:** `address` is now optional
- **Relations:** `nationalCard`, `avatar`, `provinceId`, `cityId` (unchanged)

#### `user.updateUser`
- **Removed from set:** `father_name`
- **Added to set:** `level`, `email`, `password`, `is_verified`, `bio`, `expertise`, `verified`, `verificationBadge`, `isPublic`
- **Changed:** `birth_date` now accepts ISO string (backend converts to Date)
- **Note:** All fields are optional (partial updates)

#### `user.register`
- **Removed from set:** `father_name`, `national_number`, `address`
- **Added to set:** `bio`, `expertise`
- **Changed:** `birth_date` now accepts ISO string
- **Note:** Registration auto-sets `level: "Ordinary"`, `is_verified: false`, `verified: false`, `isPublic: true`

#### `user.updateUserRelations`
- **No changes** - still handles: `avatar`, `national_card`, `province`, `city`

---

## Required Frontend Updates

### 1. Regenerate Type Declarations
Run the backend type generation to update `ReqType`:
```bash
# In backend directory
deno task gen-types  # or equivalent command
```
Then copy updated declarations to `front/src/types/declarations.ts`.

### 2. Update Server Actions

**`src/app/actions/user/add.ts`**
- Update the `set` parameter type to match new `addUser` validator
- Remove `father_name`, `mobile`, `national_number` fields
- Add `email`, `password`, `bio`, `expertise`, `verified`, `verificationBadge`, `isPublic`
- Make `address` optional

**`src/app/actions/user/update.ts`**
- Update the `set` parameter type to match new `updateUser` validator
- Remove `father_name`
- Add `level`, `email`, `password`, `is_verified`, `bio`, `expertise`, `verified`, `verificationBadge`, `isPublic`

**`src/app/actions/auth/register.ts`**
- Update the registration payload
- Remove `father_name`, `national_number`, `address`
- Add `bio`, `expertise`

### 3. Update User Forms

**Admin User Management Forms:**
- Remove `father_name`, `mobile`, `national_number` inputs
- Add new fields:
  - `bio` - Use a localized text editor or simple text inputs for each language
  - `expertise` - Use a tag-like input for adding multiple expertise items
  - `verified` - Toggle/checkbox
  - `verificationBadge` - Text input
  - `isPublic` - Toggle/checkbox
- Make `address` optional
- Add `email` and `password` fields to user creation form
- Add `level` dropdown to user edit form

**Registration Form:**
- Remove `father_name`, `national_number`, `address` inputs
- Add `bio` (optional, localized) and `expertise` (optional, array) fields

**User Profile/Edit Form:**
- Sync with the same field changes as admin forms

### 4. Update TypeScript Interfaces

Any custom interfaces extending the user schema need updating:
```typescript
// Before
interface UserWithRelations extends userSchema {
  father_name?: string;
  mobile?: string;
  national_number?: string;
}

// After
interface UserWithRelations extends userSchema {
  bio?: { fa?: string; en?: string; ar?: string; ... };
  expertise?: string[];
  verified?: boolean;
  verificationBadge?: string;
  isPublic?: boolean;
}
```

### 5. Update Translations

Add translation keys for new fields in ALL language files (`/messages/*.json`):
- `user.bio` / `user.bio.label` / `user.bio.placeholder`
- `user.expertise` / `user.expertise.label` / `user.expertise.placeholder` / `user.expertise.add`
- `user.verified` / `user.verified.label`
- `user.verificationBadge` / `user.verificationBadge.label`
- `user.isPublic` / `user.isPublic.label`

Remove or deprecate:
- `user.father_name`
- `user.mobile`
- `user.national_number`

### 6. Update Zod Validation Schemas

Update any Zod schemas used for user form validation:
```typescript
// Remove
father_name: z.string()...
mobile: z.string().regex(...)
national_number: z.string()...

// Add
bio: z.object({
  fa: z.string().optional(),
  en: z.string().optional(),
  ar: z.string().optional(),
  zh: z.string().optional(),
  pt: z.string().optional(),
  es: z.string().optional(),
  nl: z.string().optional(),
  tr: z.string().optional(),
  ru: z.string().optional(),
}).optional(),
expertise: z.array(z.string()).optional(),
verified: z.boolean().optional(),
verificationBadge: z.string().optional(),
isPublic: z.boolean().optional(),
```

### 7. Update User Display Components

Wherever user information is displayed (admin tables, profile pages, etc.):
- Remove columns/fields for `father_name`, `mobile`, `national_number`
- Add display for new fields:
  - `bio` - Show current language version
  - `expertise` - Show as badges/tags
  - `verified` - Show badge/icon
  - `verificationBadge` - Show if present
  - `isPublic` - Show visibility indicator

---

## Priority Order

1. **Regenerate types** - Foundation for everything else
2. **Update server actions** - API layer
3. **Update Zod schemas** - Validation layer
4. **Update forms** - UI layer
5. **Update translations** - i18n layer
6. **Update display components** - Presentation layer

## Testing Checklist

- [ ] User registration works without removed fields
- [ ] User creation in admin panel works with new fields
- [ ] User editing updates new fields correctly
- [ ] `bio` field saves and loads in all languages
- [ ] `expertise` array adds/removes items correctly
- [ ] `verified`, `isPublic` toggles work
- [ ] `birth_date` is properly sent as ISO string
- [ ] All form validations pass/fail correctly
- [ ] Translations appear in all 9 languages
- [ ] RTL layouts render correctly for fa/ar
- [ ] TypeScript compiles without errors
- [ ] `pnpm build:strict` passes
