# Refactor: Change Confirmation `content` from `localizedWarInfo` to `string()`

**Context**: The backend `confirmation.content` field changed from `localizedWarInfo` (nested object with 9 language keys) to a simple `string()`. The `selected_language` field already determines the language. You need to update all frontend code that reads/writes `content`.

**What changed on backend**:
- `content: localizedWarInfo` → `content: string()`
- Text index: `content.en`, `content.fa`, etc. → `content`
- Types in `/src/types/declarations.ts` need to be regenerated (`deno task gen-types` on backend)

### Files to Update

#### 1. Regenerate Types
Run on backend: `deno task gen-types` (or equivalent) to update `/src/types/declarations.ts`. The `confirmationSchema.content` will change from `{ fa?: string; en?: string; ... }` to `string`.

#### 2. Admin Forms (`/admin/confirmations/new`, `/admin/confirmations/[id]/edit`)

**Before**:
```tsx
// 9 language tabs, each with its own content field
content: {
  [locale]: z.object({ fa: z.string(), en: z.string(), ... })
}
// Form renders tabs, each tab has a RichTextEditor
<FormField name={`content.${locale}`} />
```

**After**:
```tsx
// Single content field, language determined by selected_language
content: z.string().min(1, "Content is required")

// Single Textarea or RichTextEditor
<FormField name="content" />
```

Remove the language tab loop for content. The `selected_language` select field already exists — it controls which language this confirmation is written in.

#### 3. Display Components (tables, cards, detail views)

**Before**:
```tsx
// Accessing nested language
{confirmation.content?.[locale] || confirmation.content?.en}
```

**After**:
```tsx
// Direct string access
{confirmation.content}
```

Search for patterns like `confirmation.content[` or `confirmation.content?.` and simplify.

#### 4. Server Actions

No code changes needed — types are auto-generated. But verify that `add.ts` and `update.ts` send `content` as a string, not an object.

#### 5. Zod Schemas

Update any Zod schemas that validate confirmation content:

**Before**:
```ts
content: z.object({
  fa: z.string().optional(),
  en: z.string().optional(),
  // ... 7 more
})
```

**After**:
```ts
content: z.string().min(1, "Content is required")
```

### Search Patterns

Use these to find all occurrences:
- `content\.\[locale\]` or `content\[locale\]`
- `content\?\.en` or `content\.en`
- `content: z.object`
- `content: localizedWarInfo`
- `content\.fa`, `content\.ar`, etc.
- Form fields named `content.fa`, `content.en`, etc.

### Checklist
- [ ] Regenerate types from backend
- [ ] Update Zod schemas (new/edit forms)
- [ ] Remove language tabs for content input
- [ ] Update display components (`content[locale]` → `content`)
- [ ] Update any API call payloads that send `content` as object
- [ ] Test in both RTL (fa) and LTR (en)
