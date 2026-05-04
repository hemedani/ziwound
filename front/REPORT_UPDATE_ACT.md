# How to Update Report Pure Fields via `report.update` Act

## Endpoint Overview
- **Act Name**: `report.update`
- **Access**: Manager, Editor
- **Authentication**: Required (JWT token in `Authorization: Bearer <token>` header)
- **Description**: Updates pure (non-relation) fields of a report. For updating relations, use `report.updateRelations`.

---

## Request Structure
Request body follows the validator in `update.val.ts` with a top-level `details` object:
```typescript
{
  details: {
    set: { /* Report ID + fields to update */ },
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

#### Optional Fields to Update
All fields from `models/report.ts:report_pure` (except auto-generated `createdAt`/`updatedAt`):

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Report title | "Updated: Civilian Attack in Aleppo" |
| `description` | string | Detailed incident description | "Updated description of the event..." |
| `location` | GeoJSON Point | Incident location (GeoJSON format) | `{ type: "Point", coordinates: [36.2021, 36.2080] }` (lng, lat) |
| `address` | string | Text address | "Updated address, Aleppo" |
| `status` | enum | `Pending` \| `Approved` \| `Rejected` \| `InReview` | "InReview" |
| `priority` | enum | `Low` \| `Medium` \| `High` | "Medium" |
| `selected_language` | LanguageCode | Report language (e.g., "en", "fa", "ar") | "en" |
| `crime_occurred_at` | Date | When crime occurred | `new Date("2024-05-03T14:30:00Z")` |

*Note: Only include fields you want to update. Omitted fields remain unchanged.*

---

### `get` Object (Required)
Projection specifying response fields. Using depth 2 (`selectStruct("report", 2)`) includes one level of relations:
```typescript
{ _id: 1, title: 1, status: 1, updatedAt: 1 }
```
Or use the predefined struct:
```typescript
selectStruct("report", 2)
```

---

## Sample Requests

### Update Basic Fields
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      title: "Updated: Civilian Attack in Aleppo",
      status: "InReview",
      priority: "High"
    },
    get: { _id: 1, title: 1, status: 1, updatedAt: 1 }
  }
}
```

### Update Location
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      location: { type: "Point", coordinates: [36.2021, 36.2080] },
      address: "Salah al-Din District, Aleppo"
    },
    get: selectStruct("report", 1)
  }
}
```

### Update Crime Date
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      crime_occurred_at: new Date("2024-05-03T14:30:00Z")
    },
    get: { _id: 1, crime_occurred_at: 1 }
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
    status: string,
    updatedAt: string, // Automatically set to current date
    // ... other fields from `get` projection
  }
}
```

---

## Key Notes
1. **Pure Fields Only**: This act only updates non-relation fields. For relations (tags, category, documents, countries, provinces, cities), use `report.updateRelations`.
2. **Auto Timestamp**: `updatedAt` is automatically set to the current date on every update.
3. **Partial Updates**: Only include fields you want to change. Fields not included remain unchanged.
4. **GeoJSON Format**: `location` uses `{ type: "Point", coordinates: [longitude, latitude] }` format.
5. **Date Handling**: `crime_occurred_at` should be a JavaScript Date object or ISO 8601 string.
6. **Relations Removed**: The old `country` and `city` string fields were removed. Use `hostileCountries`, `attackedCountries`, `attackedProvinces`, `attackedCities` relations via `updateRelations` instead.
