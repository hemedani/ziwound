# Ziwound Backend – API & Models Documentation for Frontend

> Generated for frontend AI agent to create TODO.md and CONTINUE.md files.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Authentication & Authorization](#authentication--authorization)
4. [Model Hierarchy & Relations](#model-hierarchy--relations)
5. [Models](#models)
6. [CRUD Acts (API Endpoints)](#crud-acts-api-endpoints)
7. [Relation Management](#relation-management)
8. [Recent Changes Summary](#recent-changes-summary)
9. [Type Declarations](#type-declarations)
10. [Important Conventions](#important-conventions)

---

## Project Overview

**Ziwound** is a war crimes documentation system with multi-language support, document management, blog functionality, and an advanced admin panel. The backend is built with **Deno + Lesan framework** and **MongoDB**.

### Core Features
- **User authentication** with JWT (roles: Ghost, Manager, Editor, Ordinary)
- **War crime report submission** with documents, tags, categories, and location data
- **Geographic hierarchy**: Country → Province → City
- **War description fields** on Country, Province, and City models
- **Hostile/Attacked country relations** on reports
- **Document management** linked to reports
- **Blog/News section** with markdown content and slug-based routing
- **Advanced filtering** (geospatial, date range, status, priority, category, tag)
- **Export functionality** (CSV, PDF)
- **Analytics & Statistics** endpoints

---

## Tech Stack

- **Runtime**: Deno
- **Framework**: Lesan (https://jsr.io/@hemedani/lesan)
- **Database**: MongoDB
- **Auth**: djwt (JWT with HS512, bcrypt for passwords)
- **File Upload**: Built-in multipart form handling
- **Validation**: Zod-like schemas built into Lesan
- **Port**: 1406
- **CORS Origins**: localhost:3000, localhost:3005, localhost:4000, and production IPs

---

## Authentication & Authorization

### JWT Configuration
- **Algorithm**: HS512
- **Expiry**: 90 days
- **Secret**: `Deno.env.get("JWT_SECRET")`

### User Levels (Roles)
| Level | Description |
|-------|-------------|
| `Manager` | Full admin access, can CRUD all models |
| `Editor` | Can edit reports, manage documents |
| `Ordinary` | Can view public content, submit reports |
| `Ghost` | Minimal access, read-only on public endpoints |

### Auth Acts
| Act | Description | Access |
|-----|-------------|--------|
| `user.login` | Login with email + password | Public |
| `user.registerUser` | Register new user | Public |
| `user.tempUser` | Create temporary/anonymous user | Public |
| `user.getMe` | Get current user profile | Authenticated |
| `user.getUser` | Get single user by ID | Manager |
| `user.getUsers` | Get paginated users | Manager |
| `user.addUser` | Create user | Manager |
| `user.updateUser` | Update user fields | Manager |
| `user.updateUserRelations` | Update user relations | Manager |
| `user.removeUser` | Delete user | Manager |
| `user.countUsers` | Count users | Manager |
| `user.dashboardStatistic` | Dashboard stats | Manager |

---

## Model Hierarchy & Relations

```
Country (1)
  └── Province (N) → has relation: country
        └── City (N) → has relation: province
              └── User (N) → has relation: city, province

Report
  ├── reporter → User (single)
  ├── documents → Document[] (multiple)
  ├── tags → Tag[] (multiple)
  ├── category → Category (single)
  ├── hostileCountries → Country[] (multiple) [NEW]
  ├── attackedCountries → Country[] (multiple) [NEW]
  ├── attackedProvinces → Province[] (multiple) [NEW]
  └── attackedCities → City[] (multiple) [NEW]

Document
  └── report → Report (single)

BlogPost
  ├── author → User (single)
  ├── coverImage → File (single)
  └── tags → Tag[] (multiple)

User
  ├── avatar → File (single)
  ├── national_card → File (single)
  ├── province → Province (single)
  └── city → City (single)

File → standalone, used by relations above

Tag
  └── registrar → User (single)

Category
  └── registrar → User (single)
```

### Key Relation Rules
- **Relations are ONE-DIRECTIONAL**: Define on the owning model only. Use `relatedRelations` for reverse access.
- **Never bidirectional**: Don't define the same relation on both models.
- **Use `addRelation`/`removeRelation`**: Never manually update relation fields.
- **Separate field updates from relation updates**: `update` for pure fields, `updateRelations` for relations.

---

## Models

### 1. Country Model

**File**: `models/country.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Country name in native language |
| `english_name` | string | Yes | Country name in English |
| `wars_history` | string | Yes | Historical wars involving this country |
| `conflict_timeline` | string | Yes | Timeline of conflicts |
| `casualties_info` | string | Yes | Casualty information |
| `international_response` | string | Yes | International community response |
| `war_crimes_documentation` | string | Yes | Documented war crimes |
| `human_rights_violations` | string | Yes | Human rights violations info |
| `genocide_info` | string | Yes | Genocide-related information |
| `chemical_weapons_info` | string | Yes | Chemical weapons usage info |
| `displacement_info` | string | Yes | Population displacement data |
| `reconstruction_status` | string | Yes | Post-war reconstruction status |
| `international_sanctions` | string | Yes | Sanctions imposed |
| `notable_war_events` | string | Yes | Notable events during wars |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `registrar` | single | User | - |
| `provinces` | multiple | Province | → `country` (single) |

#### Text Indexes (for search)
- `name`, `english_name`, `wars_history`, `conflict_timeline`, `war_crimes_documentation`, `human_rights_violations`, `genocide_info`, `notable_war_events`

---

### 2. Province Model

**File**: `models/province.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Province name |
| `english_name` | string | Yes | Province name in English |
| `wars_history` | string | Yes | Wars history in this province |
| `conflict_timeline` | string | Yes | Conflict timeline |
| `casualties_info` | string | Yes | Casualty information |
| `notable_battles` | string | Yes | Notable battles fought |
| `occupation_info` | string | Yes | Occupation details |
| `destruction_level` | string | Yes | Level of destruction |
| `civilian_impact` | string | Yes | Impact on civilian population |
| `mass_graves_info` | string | Yes | Mass graves information |
| `war_crimes_events` | string | Yes | War crimes that occurred |
| `liberation_info` | string | Yes | Liberation information |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `registrar` | single | User | - |
| `country` | single | Country | → `provinces` (multiple) |

#### Notes
- **No GeoJSON fields**: `area` and `center` were removed to simplify data entry.
- Province belongs to one Country; Country has many Provinces.

---

### 3. City Model

**File**: `models/city.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | City name |
| `english_name` | string | Yes | City name in English |
| `wars_history` | string | Yes | Wars history in this city |
| `conflict_timeline` | string | Yes | Conflict timeline |
| `casualties_info` | string | Yes | Casualty information |
| `notable_battles` | string | Yes | Notable battles fought |
| `occupation_info` | string | Yes | Occupation details |
| `destruction_level` | string | Yes | Level of destruction |
| `civilian_impact` | string | Yes | Impact on civilian population |
| `mass_graves_info` | string | Yes | Mass graves information |
| `war_crimes_events` | string | Yes | War crimes that occurred |
| `liberation_info` | string | Yes | Liberation information |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `registrar` | single | User | - |
| `province` | single | Province | → `cities` (multiple), `capital` (single) |

#### Text Indexes
- `name`, `english_name`, `wars_history`, `conflict_timeline`, `war_crimes_events`, `notable_battles`

#### Notes
- Cities are children of Provinces. When creating a city, pass `provinceId` and `isCapital` to set the `capital` reverse relation on the province.

---

### 4. User Model

**File**: `models/user.ts`

#### Pure Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `first_name` | string | Yes | - | User's first name |
| `last_name` | string | Yes | - | User's last name |
| `father_name` | string | No | - | Father's name |
| `gender` | "Male" \| "Female" | Yes | - | Gender |
| `birth_date` | Date | No | - | Birth date |
| `summary` | string | No | - | Bio/summary |
| `address` | string | No | - | Address |
| `level` | "Ghost" \| "Manager" \| "Editor" \| "Ordinary" | Yes | "Ordinary" | User role |
| `email` | string (email pattern) | Yes | - | Email (unique) |
| `password` | string | Yes | - | Password (bcrypt hashed) |
| `is_verified` | boolean | No | false | Email verification status |
| `createdAt` | Date | Auto | - | Created timestamp |
| `updatedAt` | Date | Auto | - | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `avatar` | single | File | - |
| `national_card` | single | File | - |
| `province` | single | Province | → `users` (multiple) |
| `city` | single | City | → `users` (multiple) |

#### Notes
- Email has a unique index.
- Password is never returned in responses (excluded via `excludes: ["password"]`).
- Text index on: `first_name`, `last_name`, `email`.

---

### 5. Report Model

**File**: `models/report.ts`

#### Pure Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | - | Report title |
| `description` | string | Yes | - | Detailed description |
| `location` | GeoJSON Point | No | - | Exact incident location |
| `address` | string | No | - | Text address |
| `status` | "Pending" \| "Approved" \| "Rejected" \| "InReview" | No | "Pending" | Review status |
| `priority` | "Low" \| "Medium" \| "High" | No | - | Priority level |
| `selected_language` | LanguageCode | Yes | - | Report language code |
| `crime_occurred_at` | Date | Yes | - | When the crime occurred |
| `createdAt` | Date | Auto | - | Created timestamp |
| `updatedAt` | Date | Auto | - | Updated timestamp |

#### Removed Fields (no longer used)
- ~~`country` (string)~~ → replaced by `hostileCountries` and `attackedCountries` relations
- ~~`city` (string)~~ → replaced by `attackedProvinces` and `attackedCities` relations

#### Relations
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

#### Notes
- `location` uses GeoJSON Point format for geospatial queries.
- Reports can be linked to multiple hostile countries (attackers) and multiple attacked countries/provinces/cities (victims).
- `selected_language` uses `LanguageCode` enum (e.g., "en", "fa", "ar", etc.).

---

### 6. Document Model

**File**: `models/document.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Document title |
| `description` | string | No | Document description |
| `selected_language` | LanguageCode | Yes | Document language |
| `fileType` | string | No | File type (pdf, doc, etc.) |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `report` | single | Report | → `documents` (multiple) |
| `files` | multiple | File | → `documents` (multiple) |

---

### 7. File Model

**File**: `models/file.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | File name |
| `mimeType` | string | No | MIME type |
| `size` | number | No | File size in bytes |
| `url` | string | Yes | File URL/path |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Notes
- Files are stored in `/uploads/` directory.
- Type-based directory routing: images, videos, docs.
- Served statically via `staticPath: ["/uploads"]`.

---

### 8. Tag Model

**File**: `models/tag.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Tag name |
| `color` | string | No | Hex color code |
| `icon` | string | No | Icon identifier |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `registrar` | single | User | - |
| `reports` | multiple | Report | → `tags` (multiple) |

---

### 9. Category Model

**File**: `models/category.ts`

#### Pure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Category name |
| `color` | string | No | Hex color code |
| `icon` | string | No | Icon identifier |
| `createdAt` | Date | Auto | Created timestamp |
| `updatedAt` | Date | Auto | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `registrar` | single | User | - |
| `reports` | multiple | Report | → `category` (single) |

---

### 10. BlogPost Model

**File**: `models/blogPost.ts`

#### Pure Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | - | Post title |
| `slug` | string | Yes | - | URL-friendly slug (unique) |
| `content` | string | Yes | - | Markdown/HTML content |
| `isPublished` | boolean | No | false | Publication status |
| `publishedAt` | Date | No | - | When published |
| `createdAt` | Date | Auto | - | Created timestamp |
| `updatedAt` | Date | Auto | - | Updated timestamp |

#### Relations
| Relation | Type | Target | Reverse Relation |
|----------|------|--------|-----------------|
| `author` | single | User | → `blogPosts` (multiple) |
| `coverImage` | single | File | - |
| `tags` | multiple | Tag | → `blogPosts` (multiple) |

#### Text Indexes
- `title`, `content`

---

## CRUD Acts (API Endpoints)

### Naming Convention
All acts follow the pattern: `model.actName`

| Act | Description | Input | Output |
|-----|-------------|-------|--------|
| `add` | Create new record | `set: { fields }`, `get: { projection }` | Created record |
| `get` | Get single record by ID | `set: { _id }`, `get: { projection }` | Single record |
| `gets` | Get paginated records | `set: { page, limit, filters }`, `get: { projection }` | Array of records |
| `update` | Update pure fields | `set: { _id, fields }`, `get: { projection }` | Updated record |
| `updateRelations` | Update relations only | `set: { _id, relationIds }`, `get: { projection }` | Updated record |
| `remove` | Delete record | `set: { _id, hardCascade? }`, `get: { success }` | Success status |
| `count` | Count records | `set: { filters }`, `get: { qty }` | Count object |

### Available Acts by Model

#### Country
- `country.add` – Manager only
- `country.get` – All authenticated users
- `country.gets` – All authenticated (filters: `name`, `search`)
- `country.update` – Manager only
- `country.remove` – Manager only
- `country.count` – Manager only

#### Province
- `province.add` – Manager only (accepts `countryId`)
- `province.get` – All authenticated
- `province.gets` – All authenticated (filters: `name`, `countryId`)
- `province.update` – Manager only
- `province.updateRelations` – Manager only (set `country` relation)
- `province.remove` – Manager only
- `province.count` – Manager only

#### City
- `city.add` – Manager only (accepts `provinceId`, `isCapital`)
- `city.get` – All authenticated
- `city.gets` – All authenticated (filters: `name`, `provinceId`)
- `city.update` – Manager only
- `city.remove` – Manager only
- `city.count` – Manager only

#### Report
- `report.add` – Authenticated users
- `report.get` – All authenticated
- `report.gets` – All authenticated (filters: `status`, `category`, `tag`, `userIds`, `hostileCountryIds`, `attackedCountryIds`, `attackedProvinceIds`, `attackedCityIds`, date range, geospatial)
- `report.update` – Manager, Editor
- `report.updateRelations` – Manager, Editor (manages `tags`, `category`, `documents`, `hostileCountries`, `attackedCountries`, `attackedProvinces`, `attackedCities`)
- `report.remove` – Manager
- `report.count` – Manager (filters: `status`, `priority`, `selected_language`, `categoryId`, `hostileCountryIds`, `attackedCountryIds`, `attackedProvinceIds`, `attackedCityIds`, date range)
- `report.statistics` – Manager (analytics with new relation-based filters)
- `report.exportCSV` – Manager (filters include new relation-based filters)
- `report.exportPDF` – Manager

#### Document
- `document.add` – Authenticated
- `document.get` – All authenticated
- `document.gets` – All authenticated
- `document.update` – Manager, Editor
- `document.updateRelations` – Manager, Editor
- `document.remove` – Manager
- `document.count` – Manager

#### BlogPost
- `blogPost.add` – Manager, Editor
- `blogPost.get` – All authenticated (by ID or slug)
- `blogPost.gets` – All authenticated (filters: `isPublished`, `author`, `tags`, `search`)
- `blogPost.update` – Manager, Editor
- `blogPost.updateRelations` – Manager, Editor
- `blogPost.remove` – Manager
- `blogPost.count` – Manager
- `blogPost.publish` – Manager, Editor
- `blogPost.unpublish` – Manager, Editor

#### User
- `user.login` – Public
- `user.registerUser` – Public
- `user.getMe` – Authenticated
- `user.getUser` – Manager
- `user.getUsers` – Manager
- `user.addUser` – Manager
- `user.updateUser` – Manager
- `user.updateUserRelations` – Manager
- `user.removeUser` – Manager
- `user.countUsers` – Manager
- `user.dashboardStatistic` – Manager

#### Tag / Category
- `[tag|category].add` – Manager
- `[tag|category].get` – All authenticated
- `[tag|category].gets` – All authenticated
- `[tag|category].update` – Manager
- `[tag|category].remove` – Manager
- `[tag|category].count` – Manager

#### File
- `file.uploadFile` – Authenticated
- `file.getFiles` – All authenticated

---

## Relation Management

### Adding Relations via `updateRelations`

The `report.updateRelations` act manages all report relations in one call:

```typescript
// Add relations (replace: true replaces entire relation set)
{
  _id: "reportObjectId",
  hostileCountryIds: ["countryId1", "countryId2"],     // hostile countries (attackers)
  attackedCountryIds: ["countryId3", "countryId4"],    // attacked countries (victims)
  attackedProvinceIds: ["provinceId1"],                // attacked provinces
  attackedCityIds: ["cityId1", "cityId2"],             // attacked cities
  tags: ["tagId1", "tagId2"],                          // tags (replaced)
  category: "categoryId",                              // single category (replaced)
  documentIds: ["docId1"],                             // documents (replaced)
}

// Remove specific relations (no replace, just removal)
{
  _id: "reportObjectId",
  hostileCountryIdsToRemove: ["countryId1"],
  attackedCountryIdsToRemove: ["countryId3"],
  attackedProvinceIdsToRemove: ["provinceId1"],
  attackedCityIdsToRemove: ["cityId1"],
  documentIdsToRemove: ["docId1"],
}
```

### Province-Country Relation

When adding a province, pass `countryId` in the `set` object:
```typescript
// province.add
{
  set: {
    name: "Fars",
    english_name: "Fars Province",
    countryId: "countryObjectId",
    ...warDescriptionFields
  },
  get: { _id: 1, name: 1, country: 1 }
}
```

For existing provinces, use `province.updateRelations`:
```typescript
// province.updateRelations
{
  set: {
    _id: "provinceObjectId",
    country: "countryObjectId"
  }
}
```

### City-Province-Capital Relation

When adding a city, pass `provinceId` and `isCapital`:
```typescript
// city.add
{
  set: {
    name: "Shiraz",
    english_name: "Shiraz",
    provinceId: "provinceObjectId",
    isCapital: true,
    ...warDescriptionFields
  }
}
```

This sets the `capital` reverse relation on the province.

---

## Recent Changes Summary

### Phase 8: Country Model & War Description Fields

1. **New Country Model**: Created with 12 war description fields (`wars_history`, `conflict_timeline`, `casualties_info`, `international_response`, `war_crimes_documentation`, `human_rights_violations`, `genocide_info`, `chemical_weapons_info`, `displacement_info`, `reconstruction_status`, `international_sanctions`, `notable_war_events`)

2. **Province Model Updated**: Added same war description fields as City model (10 fields), added `country` single relation with `province.updateRelations` act

3. **City Model Updated**: Added 10 war description fields

4. **GeoJSON Removed**: `area` and `center` fields removed from `pure_location` utility, simplifying data entry

5. **Report Model Changes**:
   - **Removed**: `country` (string), `city` (string) fields
   - **Added**: `hostileCountries` (many-to-many → Country), `attackedCountries` (many-to-many → Country), `attackedProvinces` (many-to-many → Province), `attackedCities` (many-to-many → City)
   - All new relations are managed via `report.updateRelations`

6. **Enhanced Filtering**:
   - `country.gets`: added `search` filter for full-text search
   - `province.gets`: added `countryId` filter
   - `city.gets`: already had `provinceId` filter

7. **Excludes Updated**: `location_excludes` added to centralize exclusion fields for location-based relations

---

## Type Declarations

Type declarations are auto-generated on server start via `typeGeneration: true` in `mod.ts`.

- **Location**: `declarations/` directory
- **Usage**: Import generated types in frontend for full type safety
- **When to regenerate**: After any model/act/schema change, restart the server
- **Content**: Includes all model types, relation types, act input/output types, validator types

The frontend should use these declarations for:
- API call type safety
- Form validation schemas
- Model field definitions
- Relation type definitions

---

## Important Conventions

### API Response Format
All responses follow:
```typescript
{ success: boolean, body: data }
```

### Lesan Framework Patterns

1. **One-Direction Relations**: Define relation on owning model only. Use `relatedRelations` for reverse access.
2. **`objectIdValidation`**: Use this in validators for ObjectId fields/arrays.
3. **`selectStruct(schemaName, depth)`**: Used in `get` object of validators to control relation depth (1 = no relations, 2 = one level deep).
4. **`addRelation`/`removeRelation`**: Always use these for managing relationships, never manual updates.
5. **Separate Updates**: `update` for pure fields only, `updateRelations` for relations only.

### File Upload
- Endpoint: `file.uploadFile`
- Max size: Configurable per file type
- Types: images, videos, docs
- Served at: `/uploads/`

### Geospatial Queries
- Reports have `location` (GeoJSON Point)
- Proximity search, bounding box queries available via `report.gets`
- Note: Province/City/Country no longer have GeoJSON fields (removed for simplicity)

### Text Search
- Country: name, english_name, war description fields
- City: name, english_name, wars_history, conflict_timeline, war_crimes_events, notable_battles
- BlogPost: title, content
- User: first_name, last_name, email
- Report: title, description

### Relation-Based Filtering (New)
Instead of string `country`/`city` fields, use relation-based filters:
- `hostileCountryIds`: Filter by hostile/attacker countries
- `attackedCountryIds`: Filter by attacked countries
- `attackedProvinceIds`: Filter by attacked provinces
- `attackedCityIds`: Filter by attacked cities

These filters are available in: `report.gets`, `report.count`, `report.statistics`, `report.exportCSV`

### Pagination
All `gets` acts use:
```typescript
{ page: number, limit: number }
```
Sort is always `_id: -1` (newest first) unless specified otherwise.
