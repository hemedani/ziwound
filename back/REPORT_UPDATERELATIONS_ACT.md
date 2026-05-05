# How to Update Report Relations via `report.updateRelations` Act

## Endpoint Overview
- **Act Name**: `report.updateRelations`
- **Access**: Manager, Editor
- **Authentication**: Required (JWT token in `Authorization: Bearer <token>` header)
- **Description**: Updates report relations (tags, category, documents, and geographic entities). Supports adding and removing relations in a single call. Uses `replace: true` for add operations to replace the entire relation set.

---

## Request Structure
Request body follows the validator in `updateRelations.val.ts` with a top-level `details` object:
```typescript
{
  details: {
    set: { /* Report ID + relation IDs to add/remove */ },
    get: { /* Projection for response */ }
  }
}
```

---

### `set` Object (Required)

#### Required Field
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `_id` | string | Report ObjectId to update | `"507f1f77bcf86cd799439020"` |

#### Add Relations (Optional - Replace Existing)
When provided, these **replace** the entire existing relation set (due to `replace: true`).

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `tags` | string[] | Tag ObjectIds (replaces all existing tags) | `["507f1f77bcf86cd799439011"]` |
| `category` | string | Single Category ObjectId (replaces existing) | `"507f1f77bcf86cd799439013"` |
| `documentIds` | string[] | Document ObjectIds (replaces all existing) | `["507f1f77bcf86cd799439014"]` |
| `hostileCountryIds` | string[] | Hostile/attacker country IDs (replaces all) | `["507f1f77bcf86cd799439015"]` |
| `attackedCountryIds` | string[] | Victim country IDs (replaces all) | `["507f1f77bcf86cd799439016"]` |
| `attackedProvinceIds` | string[] | Victim province IDs (replaces all) | `["507f1f77bcf86cd799439017"]` |
| `attackedCityIds` | string[] | Victim city IDs (replaces all) | `["507f1f77bcf86cd799439018"]` |

#### Remove Relations (Optional - Remove Specific)
When provided, these **remove** only the specified IDs from the existing relations (no replace).

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `documentIdsToRemove` | string[] | Document ObjectIds to remove | `["507f1f77bcf86cd799439014"]` |
| `hostileCountryIdsToRemove` | string[] | Hostile country IDs to remove | `["507f1f77bcf86cd799439015"]` |
| `attackedCountryIdsToRemove` | string[] | Attacked country IDs to remove | `["507f1f77bcf86cd799439016"]` |
| `attackedProvinceIdsToRemove` | string[] | Attacked province IDs to remove | `["507f1f77bcf86cd799439017"]` |
| `attackedCityIdsToRemove` | string[] | Attacked city IDs to remove | `["507f1f77bcf86cd799439018"]` |

*Note: `tags` and `category` don't have remove fields - use the add field with the updated set (excluding items to remove) since they use `replace: true`.*

---

### `get` Object (Required)
Projection specifying response fields. Using depth 2 (`selectStruct("report", 2)`) includes one level of relations:
```typescript
{ _id: 1, title: 1, tags: { _id: 1, name: 1 }, category: { _id: 1, name: 1 } }
```
Or use the predefined struct:
```typescript
selectStruct("report", 2)
```

---

## Sample Requests

### Add Relations (Replace Existing)
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      hostileCountryIds: ["507f1f77bcf86cd799439015"],
      attackedCountryIds: ["507f1f77bcf86cd799439016"],
      attackedCityIds: ["507f1f77bcf86cd799439018"],
      tags: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
    },
    get: { _id: 1, title: 1, hostileCountries: { _id: 1, name: 1 } }
  }
}
```

### Remove Specific Relations
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      hostileCountryIdsToRemove: ["507f1f77bcf86cd799439015"],
      documentIdsToRemove: ["507f1f77bcf86cd799439014"]
    },
    get: { _id: 1, title: 1 }
  }
}
```

### Mixed: Add and Remove in One Call
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      attackedProvinceIds: ["507f1f77bcf86cd799439017"],
      attackedCityIdsToRemove: ["507f1f77bcf86cd799439018"]
    },
    get: selectStruct("report", 2)
  }
}
```

---

## Response Structure
Standard Lesan format with the updated report:
```typescript
{
  success: boolean,
  body: {
    _id: string,
    title: string,
    // ... fields from `get` projection including updated relations
    hostileCountries: [...],
    attackedCountries: [...],
    attackedProvinces: [...],
    attackedCities: [...]
  }
}
```

*Note: The function performs all add/remove operations sequentially, then returns the final state of the report via `report.findOne()`.*

---

## Key Notes
1. **Add = Replace**: When adding relations with `tags`, `category`, `documentIds`, `hostileCountryIds`, etc., the entire existing relation set is replaced (not appended).
2. **Remove = Selective**: Remove operations only remove the specified IDs, keeping the rest.
3. **ObjectIds**: All IDs must be 24-character hex MongoDB ObjectIds.
4. **No Reporter**: The `reporter` relation cannot be changed via `updateRelations` (set automatically on creation).
5. **Related Relations**: The backend automatically updates reverse relations (e.g., `hostileReports` on Country, `attackedReports` on Country, `attackedByReports` on Province/City).
6. **No Pure Fields**: This act only manages relations. Use `report.update` for pure fields (title, description, status, etc.).
