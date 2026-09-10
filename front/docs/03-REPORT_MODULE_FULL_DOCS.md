# Report Module - Complete API Documentation for Frontend AI Agent

> Complete reference for all Report CRUD acts, filtering, statistics, and export endpoints.

---

## Table of Contents
1. [Model Overview](#model-overview)
2. [Authentication & Access](#authentication--access)
3. [Common Data Types](#common-data-types)
4. [CRUD Acts](#crud-acts)
   - [report.add](#1-reportadd)
   - [report.get](#2-reportget)
   - [report.gets](#3-reportgets)
   - [report.update](#4-reportupdate)
   - [report.updateRelations](#5-reportupdaterelations)
   - [report.remove](#6-reportremove)
   - [report.count](#7-reportcount)
5. [Analytics & Export](#analytics--export)
   - [report.statistics](#8-reportstatistics)
   - [report.exportCSV](#9-reportexportcsv)
   - [report.exportPDF](#10-reportexportpdf)
6. [Filtering Guide](#filtering-guide)
7. [Relation Management](#relation-management)

---

## Model Overview

### Pure Fields (`report_pure`)
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | ✅ | - | Report title |
| `description` | string | ✅ | - | Detailed description |
| `location` | GeoJSON Point | ❌ | - | `{ type: "Point", coordinates: [lng, lat] }` |
| `address` | string | ❌ | - | Text address |
| `status` | enum | ❌ | "Pending" | `Pending` \| `Approved` \| `Rejected` \| `InReview` |
| `priority` | enum | ❌ | - | `Low` \| `Medium` \| `High` |
| `selected_language` | LanguageCode | ✅ | - | "en", "fa", "ar", "tr", "ku" |
| `crime_occurred_at` | Date | ✅ | - | When crime occurred (ISO 8601) |
| `createdAt` | Date | Auto | - | Auto-generated |
| `updatedAt` | Date | Auto | - | Auto-generated |

### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `reporter` | single | User | → `reports` (multiple) |
| `documents` | multiple | Document | → `report` (single) |
| `tags` | multiple | Tag | → `reports` (multiple) |
| `category` | single | Category | → `reports` (multiple) |
| `hostileCountries` | multiple | Country | → `hostileReports` (multiple) |
| `attackedCountries` | multiple | Country | → `attackedReports` (multiple) |
| `attackedProvinces` | multiple | Province | → `attackedByReports` (multiple) |
| `attackedCities` | multiple | City | → `attackedByReports` (multiple) |

---

## Authentication & Access

All report endpoints require authentication via JWT:
```
Authorization: Bearer <token>
```

| Act | Access Level |
|-----|--------------|
| `report.add` | Manager, Editor, Ordinary |
| `report.get` | All authenticated |
| `report.gets` | All authenticated |
| `report.update` | Manager, Editor |
| `report.updateRelations` | Manager, Editor |
| `report.remove` | Manager |
| `report.count` | Manager |
| `report.statistics` | Manager |
| `report.exportCSV` | Manager |
| `report.exportPDF` | Manager |

---

## Common Data Types

### ObjectId
24-character hex string: `"507f1f77bcf86cd799439011"`

### GeoJSON Point
```typescript
{ type: "Point", coordinates: [longitude, latitude] }
// Example: { type: "Point", coordinates: [36.2021, 36.2080] }
```

### LanguageCode
Valid values: `"en"`, `"fa"`, `"ar"`, `"tr"`, `"ku"`, etc.

### Date
ISO 8601 format: `"2024-05-03T14:30:00Z"` or JavaScript `Date` object

---

## CRUD Acts

### 1. `report.add`

Creates a new war crime report. The `reporter` is automatically set to the authenticated user.

**Access**: Manager, Editor, Ordinary

#### Request
```typescript
{
  details: {
    set: {
      // Pure fields (required: title, description, selected_language, crime_occurred_at)
      title: string,
      description: string,
      selected_language: LanguageCode,
      crime_occurred_at: Date | string,
      
      // Optional pure fields
      location?: GeoJSONPoint,
      address?: string,
      status?: "Pending" | "Approved" | "Rejected" | "InReview",
      priority?: "Low" | "Medium" | "High",
      
      // Optional relation IDs
      tags?: string[],           // Tag ObjectIds
      category?: string,         // Category ObjectId
      documentIds?: string[],    // Document ObjectIds
      hostileCountryIds?: string[],
      attackedCountryIds?: string[],
      attackedProvinceIds?: string[],
      attackedCityIds?: string[],
    },
    get: { /* projection */ }
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: {
      title: "Civilian Attack in Aleppo",
      description: "Airstrikes hit residential area.",
      selected_language: "en",
      crime_occurred_at: "2024-05-03T14:30:00Z",
      priority: "High",
      location: { type: "Point", coordinates: [36.2021, 36.2080] },
      hostileCountryIds: ["507f1f77bcf86cd799439015"],
      attackedCityIds: ["507f1f77bcf86cd799439018"]
    },
    get: { _id: 1, title: 1, status: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: {
    _id: string,
    title: string,
    status: string,
    // ... fields from get projection
  }
}
```

---

### 2. `report.get`

Get a single report by ID with optional relation depth.

**Access**: All authenticated users

#### Request
```typescript
{
  details: {
    set: {
      _id: string,  // Report ObjectId
    },
    get: selectStruct("report", 2) | { /* custom projection */ }
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: { _id: "507f1f77bcf86cd799439020" },
    get: { _id: 1, title: 1, description: 1, status: 1, reporter: { _id: 1, first_name: 1, last_name: 1 } }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: [{
    _id: string,
    title: string,
    description: string,
    status: string,
    reporter: { _id: string, first_name: string, ... },
    // ... relations based on projection depth
  }]
}
```

*Note: Uses aggregation pipeline, returns array with single item.*

---

### 3. `report.gets`

Get paginated reports with advanced filtering (text search, geospatial, date range, relations).

**Access**: All authenticated users

#### Request
```typescript
{
  details: {
    set: {
      // Pagination
      page: number,       // Default: 1
      limit: number,      // Default: 10
      
      // Text search (uses MongoDB text index on title + description)
      search?: string,
      
      // Filters
      status?: "Pending" | "Approved" | "Rejected" | "InReview",
      priority?: "Low" | "Medium" | "High",
      selected_language?: LanguageCode,
      categoryIds?: string[],   // Filter by categories
      tagIds?: string[],        // Filter by tags
      userIds?: string[],       // Filter by reporters
      
      // New relation filters
      hostileCountryIds?: string[],   // Filter by hostile/attacker countries
      attackedCountryIds?: string[],  // Filter by attacked countries
      attackedProvinceIds?: string[], // Filter by attacked provinces
      attackedCityIds?: string[],    // Filter by attacked cities
      
      // Date range filters
      createdAtFrom?: Date,
      createdAtTo?: Date,
      crimeOccurredFrom?: Date,
      crimeOccurredTo?: Date,
      
      // Geospatial filters
      nearLng?: number,         // Longitude for proximity search
      nearLat?: number,         // Latitude for proximity search
      maxDistance?: number,     // Max distance in meters (default: 10000)
      bbox?: number[],          // [minLng, minLat, maxLng, maxLat]
      
      // Sorting
      sortBy?: "createdAt" | "updatedAt" | "title" | "status" | "priority" | "crime_occurred_at" | "relevance",
      sortOrder?: "asc" | "desc",
    },
    get: selectStruct("report", 2) | { /* custom projection */ }
  }
}
```

#### Sample Requests

**Basic pagination with search:**
```typescript
{
  details: {
    set: {
      page: 1,
      limit: 20,
      search: "Aleppo airstrike",
      status: "Approved"
    },
    get: selectStruct("report", 1)
  }
}
```

**Filter by new relation fields:**
```typescript
{
  details: {
    set: {
      page: 1,
      limit: 10,
      hostileCountryIds: ["507f1f77bcf86cd799439015"],
      attackedCityIds: ["507f1f77bcf86cd799439018"],
      createdAtFrom: new Date("2024-01-01")
    },
    get: selectStruct("report", 2)
  }
}
```

**Geospatial query (reports near a location):**
```typescript
{
  details: {
    set: {
      page: 1,
      limit: 10,
      nearLng: 36.2021,
      nearLat: 36.2080,
      maxDistance: 5000  // 5km radius
    },
    get: { _id: 1, title: 1, location: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: [
    {
      _id: string,
      title: string,
      description: string,
      status: string,
      // ... fields based on projection
    },
    // ... more reports
  ]
}
```

---

### 4. `report.update`

Update pure (non-relation) fields of a report.

**Access**: Manager, Editor

#### Request
```typescript
{
  details: {
    set: {
      _id: string,  // Report ObjectId
      
      // Optional fields to update
      title?: string,
      description?: string,
      location?: GeoJSONPoint,
      address?: string,
      status?: "Pending" | "Approved" | "Rejected" | "InReview",
      priority?: "Low" | "Medium" | "High",
      selected_language?: LanguageCode,
      crime_occurred_at?: Date,
    },
    get: selectStruct("report", 2) | { /* custom projection */ }
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      status: "InReview",
      priority: "High",
      title: "Updated: Civilian Attack in Aleppo"
    },
    get: { _id: 1, title: 1, status: 1, updatedAt: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: {
    _id: string,
    title: string,
    status: string,
    updatedAt: string,  // Auto-set to current date
    // ... fields from get projection
  }
}
```

*Note: `updatedAt` is automatically updated. For relation updates, use `report.updateRelations`.*

---

### 5. `report.updateRelations`

Update report relations. Supports adding (replace) and removing specific relations.

**Access**: Manager, Editor

#### Request
```typescript
{
  details: {
    set: {
      _id: string,  // Report ObjectId
      
      // Add relations (REPLACES entire relation set when provided)
      tags?: string[],              // Replaces all tags
      category?: string,            // Replaces category
      documentIds?: string[],      // Replaces all documents
      hostileCountryIds?: string[],
      attackedCountryIds?: string[],
      attackedProvinceIds?: string[],
      attackedCityIds?: string[],
      
      // Remove specific relations (no replace, just removal)
      documentIdsToRemove?: string[],
      hostileCountryIdsToRemove?: string[],
      attackedCountryIdsToRemove?: string[],
      attackedProvinceIdsToRemove?: string[],
      attackedCityIdsToRemove?: string[],
    },
    get: selectStruct("report", 2) | { /* custom projection */ }
  }
}
```

#### Sample Requests

**Add/Replace relations:**
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
    get: { _id: 1, hostileCountries: { _id: 1, name: 1 } }
  }
}
```

**Remove specific relations:**
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      hostileCountryIdsToRemove: ["507f1f77bcf86cd799439015"],
      documentIdsToRemove: ["507f1f77bcf86cd799439014"]
    },
    get: selectStruct("report", 2)
  }
}
```

**Mixed add and remove:**
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

#### Response
```typescript
{
  success: true,
  body: {
    _id: string,
    // ... all updated relations based on projection
    hostileCountries: [...],
    attackedCountries: [...],
    attackedProvinces: [...],
    attackedCities: [...],
    tags: [...],
    category: {...},
    documents: [...]
  }
}
```

*Note: The function performs all operations sequentially and returns the final report state.*

---

### 6. `report.remove`

Delete a report. Optionally cascade delete related documents.

**Access**: Manager only

#### Request
```typescript
{
  details: {
    set: {
      _id: string,          // Report ObjectId
      hardCascade?: boolean, // Default: false - if true, cascade delete relations
    },
    get: { success: 1 } | { /* projection */ }
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: {
      _id: "507f1f77bcf86cd799439020",
      hardCascade: false
    },
    get: { success: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: {
    success: true
  }
}
```

*Note: `hardCascade: true` will delete related documents and remove reverse relations.*

---

### 7. `report.count`

Count reports with filters.

**Access**: Manager

#### Request
```typescript
{
  details: {
    set: {
      // Optional filters
      status?: "Pending" | "Approved" | "Rejected" | "InReview",
      priority?: "Low" | "Medium" | "High",
      selected_language?: LanguageCode,
      categoryId?: string,
      // New relation filters
      hostileCountryIds?: string[],
      attackedCountryIds?: string[],
      attackedProvinceIds?: string[],
      attackedCityIds?: string[],
      createdAtFrom?: Date,
      createdAtTo?: Date,
    },
    get: { qty: 1 }
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: {
      status: "Pending",
      hostileCountryIds: ["507f1f77bcf86cd799439015"],
      createdAtFrom: new Date("2024-01-01")
    },
    get: { qty: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: {
    qty: 42
  }
}
```

---

## Analytics & Export

### 8. `report.statistics`

Get comprehensive statistics about reports (status counts, category distribution, monthly trends, geographic distribution by hostile/attacked countries, etc.).

**Access**: Manager

#### Request
```typescript
{
  details: {
    set: {
      // Optional filters
      status?: "Pending" | "Approved" | "Rejected" | "InReview",
      priority?: "Low" | "Medium" | "High",
      selected_language?: LanguageCode,
      categoryId?: string,
      // New relation filters
      hostileCountryIds?: string[],
      attackedCountryIds?: string[],
      attackedProvinceIds?: string[],
      attackedCityIds?: string[],
      createdAtFrom?: Date,
      createdAtTo?: Date,
      crimeOccurredFrom?: Date,
      crimeOccurredTo?: Date,
    },
    get: selectStruct("report", 1)
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: {
      createdAtFrom: new Date("2024-01-01"),
      status: "Approved",
      hostileCountryIds: ["507f1f77bcf86cd799439015"]
    },
    get: { _id: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: {
    total: [{ count: 150 }],
    statusCounts: [
      { _id: "Pending", count: 50 },
      { _id: "Approved", count: 70 },
      { _id: "InReview", count: 20 },
      { _id: "Rejected", count: 10 }
    ],
    categoryCounts: [
      { _id: "War Crimes", count: 60 },
      { _id: "Human Rights Violations", count: 40 },
      // ...
    ],
    priorityCounts: [
      { _id: "High", count: 80 },
      { _id: "Medium", count: 50 },
      { _id: "Low", count: 20 }
    ],
    languageCounts: [
      { _id: "en", count: 100 },
      { _id: "fa", count: 50 }
    ],
    hostileCountryCounts: [
      { _id: "Israel", count: 60 },
      { _id: "Russia", count: 40 },
      // ...
    ],
    attackedCountryCounts: [
      { _id: "Syria", count: 70 },
      { _id: "Ukraine", count: 30 },
      // ...
    ],
    attackedProvinceCounts: [
      { _id: "Aleppo", count: 40 },
      { _id: "Idlib", count: 30 },
      // ...
    ],
    attackedCityCounts: [
      { _id: "Aleppo City", count: 25 },
      { _id: "Homs", count: 20 },
      // ...
    ],
    monthlyCounts: [
      { _id: "2024-01", count: 30 },
      { _id: "2024-02", count: 45 },
      // ...
    ],
    crimeOccurredMonthlyCounts: [
      { _id: "2024-01", count: 25 },
      // ...
    ],
    geographicCounts: [
      { _id: { lng: 36.2, lat: 36.2 }, count: 15 },
      // ...
    ]
  }
}
```

---

### 9. `report.exportCSV`

Export filtered reports to CSV format.

**Access**: Manager

#### Request
```typescript
{
  details: {
    set: {
      // Same filters as report.gets
      search?: string,
      status?: "Pending" | "Approved" | "Rejected" | "InReview",
      priority?: "Low" | "Medium" | "High",
      selected_language?: LanguageCode,
      categoryIds?: string[],
      tagIds?: string[],
      userIds?: string[],
      // New relation filters
      hostileCountryIds?: string[],
      attackedCountryIds?: string[],
      attackedProvinceIds?: string[],
      attackedCityIds?: string[],
      createdAtFrom?: Date,
      createdAtTo?: Date,
      crimeOccurredFrom?: Date,
      crimeOccurredTo?: Date,
      nearLng?: number,
      nearLat?: number,
      maxDistance?: number,
      bbox?: number[],
      sortBy?: string,
      sortOrder?: "asc" | "desc",
      limit?: number,  // Default: 1000
    },
    get: selectStruct("report", 2)
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: {
      status: "Approved",
      hostileCountryIds: ["507f1f77bcf86cd799439015"],
      createdAtFrom: new Date("2024-01-01"),
      limit: 500
    },
    get: { _id: 1, title: 1, status: 1, createdAt: 1 }
  }
}
```

#### Response
```typescript
{
  success: true,
  body: "_id,title,status,createdAt\n507f1f77bcf86cd799439020,Civilian Attack,Pending,2024-05-03T14:30:00.000Z\n..."
}
```

*Note: Returns CSV string. `limit` defaults to 1000 rows.*

---

### 10. `report.exportPDF`

Export a single report to PDF (currently returns text representation).

**Access**: Manager

#### Request
```typescript
{
  details: {
    set: {
      _id: string,  // Report ObjectId
    },
    get: selectStruct("report", 2)
  }
}
```

#### Sample Request
```typescript
{
  details: {
    set: { _id: "507f1f77bcf86cd799439020" },
    get: selectStruct("report", 2)
  }
}
```

#### Response
```typescript
{
  success: true,
  body: "War Crimes Report\n\nID: 507f1f77bcf86cd799439020\nTitle: Civilian Attack in Aleppo\n..."
}
```

*Note: Current implementation returns text. Full PDF generation requires PDF library integration.*

---

## Filtering Guide

### Text Search
Uses MongoDB text index on `title` and `description`:
```typescript
{ set: { search: "Aleppo airstrike" }, ... }
```

### Date Range Filtering
```typescript
{
  set: {
    createdAtFrom: new Date("2024-01-01"),
    createdAtTo: new Date("2024-12-31"),
    crimeOccurredFrom: new Date("2024-01-01"),
    crimeOccurredTo: new Date("2024-12-31"),
  },
  ...
}
```

### Geospatial Filtering

**Bounding Box** (rectangular area):
```typescript
{
  set: {
    bbox: [35.5, 36.0, 37.0, 37.5]  // [minLng, minLat, maxLng, maxLat]
  },
  ...
}
```

**Proximity Search** (circular area):
```typescript
{
  set: {
    nearLng: 36.2021,
    nearLat: 36.2080,
    maxDistance: 5000  // 5km radius
  },
  ...
}
```

### Relation Filtering
Filter by related model IDs:
```typescript
{
  set: {
    categoryIds: ["507f1f77bcf86cd799439013"],
    tagIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    userIds: ["507f1f77bcf86cd799439021"]  // Filter by reporter
  },
  ...
}
```

### Sorting Options
```typescript
{
  set: {
    sortBy: "createdAt",  // | "updatedAt" | "title" | "status" | "priority" | "crime_occurred_at" | "relevance"
    sortOrder: "desc"     // | "asc"
  },
  ...
}
```

*Note: `sortBy: "relevance"` only works with `search` parameter.*

---

## Relation Management

### Key Rules
1. **One-Directional**: Relations defined on Report model only. Reverse access via `relatedRelations`.
2. **Use Dedicated Acts**: Pure fields → `report.update`, Relations → `report.updateRelations`
3. **Add = Replace**: Adding relations replaces the entire set (not append)
4. **Remove = Selective**: Removing relations only removes specified IDs

### Relation Summary

| Relation | Type | Add Field | Remove Field |
|----------|------|-----------|--------------|
| `reporter` | single | Auto-set on create | Cannot change |
| `tags` | multiple | `tags` (replaces all) | Not supported (use `tags` with updated set) |
| `category` | single | `category` (replaces) | Not needed (just set new one) |
| `documents` | multiple | `documentIds` (replaces all) | `documentIdsToRemove` |
| `hostileCountries` | multiple | `hostileCountryIds` (replaces all) | `hostileCountryIdsToRemove` |
| `attackedCountries` | multiple | `attackedCountryIds` (replaces all) | `attackedCountryIdsToRemove` |
| `attackedProvinces` | multiple | `attackedProvinceIds` (replaces all) | `attackedProvinceIdsToRemove` |
| `attackedCities` | multiple | `attackedCityIds` (replaces all) | `attackedCityIdsToRemove` |

### Example: Complete Report Creation Flow

1. **Create Report** (`report.add`):
```typescript
{
  details: {
    set: {
      title: "Incident Report",
      description: "...",
      selected_language: "en",
      crime_occurred_at: "2024-05-03T14:30:00Z",
      // Optionally add initial relations
      hostileCountryIds: ["countryId1"],
      attackedCityIds: ["cityId1"]
    },
    get: { _id: 1 }
  }
}
```

2. **Add More Relations** (`report.updateRelations`):
```typescript
{
  details: {
    set: {
      _id: "reportId",
      tags: ["tagId1", "tagId2"],
      category: "categoryId",
      documentIds: ["docId1"]
    },
    get: selectStruct("report", 2)
  }
}
```

3. **Update Fields** (`report.update`):
```typescript
{
  details: {
    set: {
      _id: "reportId",
      status: "InReview",
      priority: "High"
    },
    get: { _id: 1, status: 1 }
  }
}
```

---

## Projection Helpers

### Using `selectStruct`
Predefined projection with relation depth:
```typescript
// Depth 1: No relations
selectStruct("report", 1)
// Returns: { _id: 1, title: 1, description: 1, ...pure fields only }

// Depth 2: One level of relations
selectStruct("report", 2)
// Returns: { _id: 1, ..., reporter: { _id: 1, ... }, tags: [{ _id: 1, ... }], ... }
```

### Custom Projection
Specify exact fields:
```typescript
{
  _id: 1,
  title: 1,
  status: 1,
  reporter: { _id: 1, first_name: 1, last_name: 1 },
  category: { _id: 1, name: 1 },
  hostileCountries: { _id: 1, name: 1, english_name: 1 }
}
```

---

## Error Handling

All endpoints return standard Lesan response format:
```typescript
{
  success: boolean,
  body: data | error message
}
```

Common errors:
- **401 Unauthorized**: Invalid/missing JWT token
- **403 Forbidden**: Insufficient access level
- **400 Validation Error**: Invalid input (wrong ObjectId format, missing required fields, etc.)
- **404 Not Found**: Report with specified ID doesn't exist

---

## Summary Table

| Act | Access | Description |
|-----|--------|-------------|
| `report.add` | All Auth | Create new report |
| `report.get` | All Auth | Get single report by ID |
| `report.gets` | All Auth | Paginated list with filters |
| `report.update` | Manager, Editor | Update pure fields |
| `report.updateRelations` | Manager, Editor | Update relations |
| `report.remove` | Manager | Delete report |
| `report.count` | Manager | Count with filters |
| `report.statistics` | Manager | Analytics dashboard |
| `report.exportCSV` | Manager | Export to CSV |
| `report.exportPDF` | Manager | Export to PDF |
