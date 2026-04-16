# Ziwound Backend - Deno Application

(adapted from Naghshe backend)

## Project Overview

Ziwound backend is a Deno + Lesan application for a war crimes documentation system. Models include User, Report (war crime reports with title, description, attachments, tags, location, status, etc.), Document (supporting documents related to reports), Blog (blog posts and articles), File, Tag, and any required extra models.

### Architecture

- **Backend Framework**: Lesan (MongoDB-based ODM/ORM framework for Deno)
- **Runtime**: Deno
- **Database**: MongoDB
- **File Storage**: Static file uploads managed through the backend
- **API**: REST/GraphQL API with automatic playground generation
- **Authentication**: JWT-based with jose library

### Core Technologies

- **Backend Runtime**: Deno
- **Framework**: Lesan (v0.1.26)
- **Database**: MongoDB (with GeoJSON support)
- **Authentication**: djwt library
- **Containerization**: Docker

## Key Features

### Backend (Lesan Framework)

- Schema-based data modeling with validation
- Automatic API generation with playground interface
- MongoDB ODM with relationship management and GeoJSON support
- CORS support for frontend integration
- File upload functionality with static file serving
- Type generation for frontend integration

### Data Models

The backend defines the following core models:

- Users - User authentication and authorization
- Files - File upload management
- Places - Location-based entities with GeoJSON support
- Categories - Categorization system
- Provinces/Cities/City Zones - Geographic hierarchy
- Comments - User feedback and reviews
- Tags - Metadata categorization
- Virtual Tours - 360-degree tour functionality
- Reports - War crime reports with title, description, attachments (files), tags (multiple), location (GeoJSON Point), status, priority, reporter relation, category relation
- Documents - Supporting documents related to reports (title, description, document files (multiple), multiple relations to Reports - each report can have several documents)
- Blog Posts - Blog articles with title, content, author, cover image, publish status, tags, and publication date

## Recent Implementation Notes

This section documents key features and implementations added in recent development sessions:

### Document Model Implementation

- **Schema**: Title, description, documentFiles (multiple file relations), report relation (single to Report)
- **CRUD Acts**: add, get, gets, update, updateRelations, remove, count
- **Features**: Text indexes for search, one-direction relations (owned by Report)
- **File Support**: Extended file upload to support document types (PDF, DOC, DOCX, XLS, XLSX, TXT)

### BlogPost Model Implementation

- **Schema**: Title, slug (unique), content (markdown/HTML), author (User), coverImage (File), isPublished, publishedAt, tags (multiple)
- **CRUD Acts**: add, get, gets, update, updateRelations, remove, count
- **Advanced Features**:
  - Publish/unpublish actions (separate endpoints)
  - Get by slug for SEO-friendly URLs
  - Get related posts based on shared tags
  - Featured posts filtering
  - Full-text search on title and content
  - Unique slug index

### Enhanced Report Exploration

- **Advanced Filtering**: Date range (createdAt), geospatial (bbox, proximity search), status, priority, category, tags, user
- **Analytics Endpoint**: Statistics with counts by status, category, priority, monthly timeline, geographic distribution
- **Export Functionality**: CSV export for bulk data, PDF export for individual reports
- **Geospatial Queries**: Bounding box and radius-based location filtering

### Security & Performance Improvements

- **Rate Limiting**: In-memory rate limiter (100 requests/minute per user/IP) on report submissions
- **Bug Fixes**: Corrected field names in countUsers, added missing fields in category.update, fixed typos (mimType → mimeType), updated invalid user levels
- **Authentication**: Added JWT authentication to Province/City/Tag/Category endpoints (previously public)
- **Indexes**: Text indexes for search, 2dsphere for geospatial, unique constraints

### API Playground & Type Generation

- All new endpoints accessible via playground at `http://localhost:1406/playground`
- Automatic TypeScript type declarations generated for frontend integration
- CORS configured for multiple origins including localhost and production domains

### Development Workflow

- **One-step implementation**: Each feature implemented atomically with TODO updates and git commits
- **Lesan Framework Patterns**: Strict adherence to one-direction relations, separate pure/relation updates, proper validation
- **Testing**: Server runs successfully with all endpoints functional
- **Docker Support**: Production-ready containerization with multi-stage build

### Key Technical Decisions

- **Relations**: One-direction only, using `relatedRelations` for reverse access
- **Validation**: Zod-like schemas with `objectIdValidation` for ObjectIds
- **File Upload**: Type-based directory routing, size limits (10MB), mime validation
- **Geospatial**: 2dsphere indexes, GeoJSON Point/MultiPolygon support
- **Search**: MongoDB text indexes with relevance scoring
- **Security**: HS512 JWT, bcrypt hashing, role-based access control

## Project Structure

```
ziwound/back/
├── deno.json               # Deno project configuration
├── deps.ts                 # Dependency imports
├── mod.ts                  # Main application entry point
├── Dockerfile              # Multi-stage Docker configuration
├── Models.md               # Data models documentation
├── declarations/           # Generated type declarations
├── models/                 # Data model definitions
│   ├── utils/              # Model utilities
│   └── *.ts                # Individual model files
├── src/                    # API route and logic implementations
│   ├── mod.ts              # Functions setup module
│   └── [model_name]/       # Individual model routes and logic
├── test/                   # Test files
├── uploads/                # Static file uploads directory
└── utils/                  # Utility functions
```

## Building and Running

### Development Environment

**Deno development (with auto-reload):**

```bash
cd back/
deno task bc-dev  # Runs with auto-reload for development
```

### Production Deployment

**Docker-based Production:**

```bash
# Build production image
docker build --target production -t ziwound-backend:production .

# Or run with docker-compose (from project root)
docker-compose up --build
```

## Environment Configuration

The application uses environment variables:

- `MONGO_URI`: MongoDB connection string (defaults to "mongodb://127.0.0.1:27017/")
- `ENV`: Environment mode (development/production)
- `APP_PORT`: Application port (defaults to 1405)

## API Documentation

The backend provides an API playground accessible when the application is running, allowing for interactive API exploration and testing.

## Development Conventions

### Backend (Deno/Lesan)

- Uses Lesan framework for API generation and data modeling
- TypeScript with strict typing
- Zod-like validation syntax for schema definitions
- Auto-generated type declarations for frontend integration
- MongoDB ODM with relationship support and GeoJSON fields
- Proper file structure with models, routes, and utilities in separate directories

## Lesan Framework Complete Documentation

### Core Concepts

Lesan is a web server and ODM (Object Document Model) framework designed to implement microservices with a focus on performance and data management. The core concepts include:

1. **Delegated Data Retrieval**: Inspired by GraphQL, Lesan delegates data retrieval management to the client without adding extra layers like GQL language processors.

2. **NoSQL Capabilities**: Leverages all capabilities of NoSQL databases to embed relationships within schemas without requiring server-side programmers to manage embeddings.

3. **Regular Structure for Validation**: Maintains a structured approach similar to SQL for data models in the ODM layer to ensure data validation.

4. **Advanced Relationship Management**: Provides a new definition for creating relationships between data, allowing full control over their details.

5. **Movable Data Structure**: Enables the data structure to move along with server-side functions for easier microservice management.

### Microservices Architecture

#### Traditional Challenges and Lesan Solution

**Challenges in Traditional Microservices:**

- Model consistency across services
- Data consistency when services fail to communicate
- Complex hardware resource distribution
- Difficult horizontal scaling

**Lesan's Solution:**

- Provides "small solutions for implementation of microservices that can reduce their implementation complexity"
- Proposes a new architecture that sits between microservices and monoliths
- Uses a unified database model with service-specific validation
- Eliminates data duplication and synchronization needs

**Unified Database Approach:**

- Create a comprehensive database with all possible models and fields
- Each service validates only the data relevant to it
- Services can share the same comprehensive model while working with only required fields
- Prevents data duplication and eliminates need for synchronization tools

### Function Structure

#### Main Components:

- **schemas**: Contains schema functions (getSchemas, getPureOfMainRelations, getSchema, etc.)
- **acts**: Action functions (setAct, getServiceKeys, getActs, etc.)
- **odm**: Object Document Model functions (setDb, getCollection, newModel, etc.)
- **contextFns**: Context management functions (getContextModel, setContext, addContext, etc.)

#### Key Functions:

- **setAct**: Used to register actions that define the API endpoints
- **newModel**: Creates a new data model with associated CRUD operations
- **addRelation** / **removeRelation**: Functions for managing relationships between data
- **find** / **findOne**: Functions for querying data with flexible projection
- **insertOne** / **insertMany**: Functions for creating new records
- **findOneAndUpdate**: Updates a single record based on criteria
- **deleteOne**: Deletes a single record
- **countDocument**: Counts documents matching specified criteria

### Validation Patterns

1. **Schema-based Validation**: Uses a structured schema approach with `set` and `get` objects:
   - `set`: Contains input parameters for the function
   - `get`: Defines the projection structure using `selectStruct`

2. **Type Safety**: Supports TypeScript with strong type definitions throughout the framework.

3. **Superstruct Validation**: Implements validation syntax using Superstruct for schema definitions.

4. **Relationship Validation**: Provides mechanisms to validate relationships between different data models.

5. **Depth Penetration Validation**: The `selectStruct` function dynamically generates validation schemas based on model and desired depth, with two parameters:
   - Model name for which to generate the validation object
   - Depth of penetration (number or object)

6. **Application-level Filters**: Validators should use application-level filtering parameters rather than exposing database-specific operators (e.g., avoid $gte, $lte, $regex in validators). Instead of accepting MongoDB operators directly from frontend, create application-specific parameters that are transformed into appropriate database queries internally. This approach provides better security and abstraction.

7. **Typed Relations**: When working with relationships, use `TInsertRelations<typeof model_relations>` to ensure type safety when defining relations in functions like `insertOne`. This provides compile-time validation of relation fields and helps prevent runtime errors.

8. **Relationship Replace Option**: The `replace` option in `addRelation` should be used with caution. When true, it deletes all existing relationships and replaces them with new ones, affecting all embedded relationships. For single-type relations, if `replace` is false and a relation already exists, an error occurs; if true, replacement occurs. For multiple-type relations, if `replace` is false, new documents are added to existing relations; if true, all existing relations are replaced. Always consider the implications before using `replace: true`.

9. **Sort Order Type Definition**: When defining relationship sorting, always include the `RelationSortOrderType` for the sort order field. For example: `order: "desc" as RelationSortOrderType`.

### Function Implementation Best Practices

1. **Model Access**: Always access models through the coreApp.odm namespace. For example, use `coreApp.odm.user` instead of importing user directly.

2. **Separation of Concerns**: In update functions (like updateUser), only update pure fields, and use separate update relation functions (like updateUserRelations) for managing relationships. This follows the principle of separating data field updates from relationship updates.

### Request Flow and HTTP Methods

#### Supported HTTP Methods:

- **GET**: Two models supported:
  - Static document requests (requires `staticPath` configuration in `runServer`)
  - Playground access requests (requires `playground: true` in `runServer`)
- **POST**: Two models supported:
  - Data retrieval requests with JSON body containing service, model, act, and details
  - Document upload requests following standard file upload protocols

#### POST Request Structure:

- **service**: Selects microservice (defaults to "main")
- **model**: Selects data model
- **act**: Selects action
- **details**: Contains data and selection criteria
  - `set`: Information needed in Act function
  - `get`: Selected information to return (MongoDB projection format)

### Relationship Management

**Important Note:** In Lesan, relations are one-direction. The model that owns the relation defines it, and the `relatedRelations` property automatically creates and updates the reverse relation on the target model. Do not define bidirectional relations manually, as this can lead to inconsistencies.

#### Types of Relationships:

- **relation**: Defines relationships from the parent document to other documents
- **relatedRelations**: Defines the reverse relationships that get created on the target model

#### Relationship Types:

1. **Single Relations**: Defined with `type: "single"` as `RelationDataType`
2. **Multiple Relations**: Defined with `type: "multiple"` as `RelationDataType`
3. **Embedded Relations**: Store related data directly within parent document

#### Core Relationship Properties:

- **optional**: Whether the relationship is required or optional
- **schemaName**: The name of the schema this relationship connects to
- **type**: The relationship type ("single" or "multiple")
- **relatedRelations**: Defines the reverse relationships that get created on the target model
- **limit**: For multiple relations, limits the number of embedded documents
- **sort**: Defines sorting for embedded multiple relations
- **excludes**: Specifies which fields to exclude from the related data when projecting

#### Managing Relations:

- **addRelation Function**: Used instead of manual updates to add relationships between documents
- **removeRelation Function**: Used instead of manual updates to remove relationships between documents
- **Important**: Never manually update relationships with update or updateMany functions

#### addRelation Function Parameters:

- **filters**: MongoDB findOne filter to find the document to change
- **relations**: Object describing the relations to establish
- **projection**: Specifies which fields to return after relation is added
- **replace** (optional): When true, deletes existing relationships and replaces them with new ones (affects all embedded relationships). For single relationships, if replace is false and a relationship already exists, an error occurs; if true, the replacement occurs. For multiple relationships, if replace is false, new documents are added to existing relationships; if true, all existing relations are replaced. Use with caution as it affects all embedded relationships.

**Usage Pattern**: When designing your API, separate document property updates from relationship updates. Use findOneAndUpdate for document properties and addRelation/removeRelation specifically for managing relationships. This separation ensures data integrity and proper handling of relation cascades.

#### removeRelation Function Parameters:

- **filters**: MongoDB findOne filter to find the document to change
- **relations**: Object specifying which relationships to remove
- **projection**: Specifies which fields to return after relation is removed

### Function Implementation Patterns

#### Add Function Pattern:

```typescript
const addEntityValidator = () => {
  return object({
    set: object({
      ...pureFields,
      relationField: objectIdValidation, // for single relations
      // or relationField: array(objectIdValidation) for multiple
    }),
    get: coreApp.schemas.selectStruct("entity", 1),
  });
};

const addEntity: ActFn = async (body) => {
  const { relationField, ...otherFields } = body.details.set;

  return await model.insertOne({
    doc: { ...otherFields },
    projection: body.details.get,
    relations: {
      relationField: {
        _ids: [new ObjectId(relationField)], // Always use arrays
        relatedRelations: {
          reverseRelation: true, // or false depending on requirements
        },
      },
    },
  });
};
```

#### Get Function Pattern:

```typescript
const getEntityValidator = () => {
  return object({
    set: object({
      entityId: objectIdValidation, // Input parameters
    }),
    get: coreApp.schemas.selectStruct("entity", 1), // Projection structure
  });
};

const getEntity: ActFn = async (body) => {
  const {
    set: { entityId },
    get,
  } = body.details;

  return await model.findOne({
    filters: { _id: new ObjectId(entityId) }, // Match/filters parameter
    projection: get, // Get/projection parameter
  });
};
```

#### Gets Function Pattern:

```typescript
const getEntitiesValidator = () => {
  return object({
    set: object({
      page: number().optional().default(1), // Pagination parameters
      limit: number().optional().default(50),
      skip: number().optional(),
      // Additional filter parameters as needed
    }),
    get: coreApp.schemas.selectStruct("entity", 1), // Projection
  });
};

const getEntities: ActFn = async (body) => {
  let {
    set: { page, limit, skip },
    get,
  } = body.details;

  skip = skip || limit * (page - 1);

  return await model
    .find({
      filters: {}, // Match/filters parameter
      projection: get, // Get/projection parameter
    })
    .skip(skip) // Skip parameter
    .limit(limit) // Limit parameter
    .toArray();
};
```

#### find and findOne Functions

**Parameters:**

- **filters**: MongoDB query operation to filter documents
- **projection**: MongoDB projection operation to specify which fields to return
- **options** (optional): MongoDB findOptions for additional configuration

**Key Features:**

- findOne retrieves a single document based on provided filters
- find retrieves multiple documents based on provided filters
- Both support relationship embedding through projection
- Both allow specifying depth of relationships to include
- find supports pagination when combined with .skip() and .limit() methods

#### Aggregation Functions

**Parameters:**

- **pipeline**: An array of MongoDB aggregation pipeline stages
- **projection**: Defines the fields to be returned in the response, including related data

**Usage:**

- Used when penetrating more than one step in relationship depths
- Relationship penetration is always one step behind the client request
- Can be used instead of find and findOne
- Automatically creates lookup, unwind and projection pipelines based on client's get input

### MongoDB Text Indexes and Full-Text Search

#### Creating Text Indexes

Text indexes enable full-text search capabilities on model fields. Define them in the model configuration:

```typescript
export const categories = () =>
  coreApp.odm.newModel("category", shared_relation_pure, createSharedRelations(), {
    createIndex: {
      indexSpec: {
        name: "text",
        description: "text",
      },
    },
  });
```

**Important Notes:**

- Text indexes support multiple fields in a single index
- Only one text index per collection is allowed
- Common fields to index: `name`, `description`, `title`, or any searchable text content

#### Full-Text Search in Gets Functions

Pattern for implementing text search with relevance scoring:

```typescript
const pipeline: Document[] = [];

// 1. Text search using MongoDB text index
search &&
  pipeline.push({
    $match: { $text: { $search: search } },
  });

// 2. Add text search score for sorting if search term exists
if (search && (!sortBy || sortBy === "relevance")) {
  pipeline.push({
    $addFields: {
      textScore: { $meta: "textScore" },
    },
  });
}

// 3. Sorting
const sortField = sortBy === "relevance" ? "textScore" : sortBy || "_id";
const sortDirection = sortOrder === "asc" ? 1 : -1;
pipeline.push({ $sort: { [sortField]: sortDirection } });

// 4. Pagination
const calculatedSkip = skip ?? limit * (page - 1);
pipeline.push({ $skip: calculatedSkip });
pipeline.push({ $limit: limit });
```

#### Search and Sort Validator Pattern

```typescript
import { enums, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { pagination } from "@lib";

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      // Text search
      search: optional(string()),
      // Sort options
      sortBy: optional(enums(["createdAt", "updatedAt", "name"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("category", 2),
  });
};
```

**Common sortBy values:**

- `createdAt`, `updatedAt` - Timestamp fields
- `name`, `title` - Text fields
- `relevance` - Special value for text search score sorting
- `status`, `priority` - Status/priority fields

### Update and Delete Operations

#### findOneAndUpdate Function

**Parameters:**

- **filter**: Defines which document to update (MongoDB filter)
- **projection**: Specifies which fields to return
- **update**: Defines how to update the document (MongoDB update operators)

**Important Note**: The findOneAndUpdate function should be used only for updating document properties, not relationships. For updating relationships, use addRelation and removeRelation functions.

**Complex Update Scenarios:**

- QQ (Query Queue): Queue of commands for chunking millions of updates
- In-Memory Database: Track changes to sent information in RAM
- Make New Relation: Convert frequently changing fields into new schemas with relationships

#### deleteOne Function

**Parameters:**

- **filter**: (Required) MongoDB filter object to specify which document to delete
- **hardCascade**: (Optional) Boolean value to enable recursive deletion of related documents
- **get**: (Optional) Object to specify which fields to return after deletion

**Features:**

- Automatically checks for related documents before deletion
- Prevents deletion with error message if related documents would become meaningless
- Supports hard cascade deletion for recursive deletion of dependent documents

#### countDocument Function

**Parameters:**

- **filter**: (Required) MongoDB filter object to specify which documents to count

**Features:**

- Returns the number of documents that match the provided filter
- Efficiently counts documents without returning the actual documents

#### insertMany Function

**Parameters:**

- **docs**: An array of document objects to be inserted
- **projection**: Specifies which fields to return in the result
- **relations**: An object defining relationships to establish with other documents

**Features:**

- Validates all input data before execution
- Handles all types of relationships: one-to-many, many-to-many, and one-to-one
- All changes are sent to the database using an aggregation pipeline
- Significantly faster than other platforms for large data insertions

### Depth Penetration

The server-side programmer must determine the depth of relationships for each accessible endpoint before writing the accessible point. This prevents unbounded queries that could impact performance.

When using selectStruct with a number, it applies that depth to all relationships in the model. When using an object, you can specify different depths for different relationships.

### Queuing Data Changes (QQ System)

The QQ (Query Queue) system addresses the challenge of repeated data updates:

- Manages large numbers of updates by dividing them into smaller, processable parts
- Monitors server resources and sends small parts for updating based on available resources
- Reduces request count by comparing and merging similar requests
- Can verify consistency of repeated data and find/correct problems
- Supports AI integration for managing changes in the queue

### Playground Features

The interactive playground provides:

- Tabs for multiple simultaneous tasks
- Service, schema, and action selectors
- Set and get fields sections
- Response section with status indicators
- Settings for custom URLs and headers
- History of requests and responses
- E2E testing capabilities with sequence management
- Schema and act documentation
- Performance metrics

### Performance Conclusion

According to the documentation's benchmarks, Lesan significantly outperforms other frameworks:

- 1168% faster than Prisma-Express-REST (PostgreSQL)
- 1417% faster than Prisma-Express-GraphQL (PostgreSQL)
- 4435% faster than Mongoose-Express-REST (without sorting)
- 72289% faster than MongoDB-Express-REST (without sorting)
- 298971% faster than Mongoose-Express-REST (with sorting)

The trade-off is a minimal performance impact on create, update, and delete operations for significantly faster data retrieval, making it ideal for read-heavy applications.

### Philosophy

Lesan's core philosophy centers on simplifying the client-server communication process, maximizing NoSQL database capabilities, and enabling scalable microservice architectures. It focuses on performance by embedding relationships within documents, reducing the number of database queries needed for complex data retrieval operations. The framework addresses traditional challenges with GraphQL and SQL by providing database-optimized filtering and embedded relationships that maintain efficiency even with deep nested data access patterns.

---

# Lesan Framework Architecture Guide

## Project Structure

```
back/
├── mod.ts                      # Main entry point - initializes Lesan, models, and server
├── deps.ts                     # Centralized dependency imports
├── deno.json                   # Deno configuration and import maps
│
├── models/                     # Data model definitions
│   ├── mod.ts                  # Re-exports all models and utilities
│   ├── [model].ts              # Individual model files (pure fields + relations)
│   ├── excludes.ts             # Centralized field exclusion lists
│   └── utils/
│       ├── geoJSONStruct.ts    # GeoJSON validation schemas
│       ├── pureLocation.ts     # Reusable location fields
│       └── sharedRelations.ts  # Shared relation patterns
│
├── src/                        # API route implementations
│   ├── mod.ts                  # Main setup function - calls all model setups
│   └── [model]/
│       ├── mod.ts              # Model setup - calls all action setups
│       ├── [action]/
│       │   ├── mod.ts          # Action setup (registers with Lesan)
│       │   ├── [action].fn.ts  # Function implementation
│       │   └── [action].val.ts # Validator definition
│
├── utils/                      # Shared utilities
│   ├── mod.ts                  # Re-exports all utilities
│   ├── grantAccess.ts          # Authorization middleware
│   ├── setUser.ts              # User context extraction from JWT
│   ├── setToken.ts             # JWT token parsing
│   ├── context.ts              # TypeScript context type definitions
│   ├── createUpdateAt.ts       # Timestamp fields mixin
│   └── throwError.ts           # Error handling utility
│
├── uploads/                    # Static file uploads directory
└── declarations/               # Auto-generated type declarations
```

---

## Core Concepts

### Lesan Application Initialization

The main entry point (`mod.ts`) follows this pattern:

```typescript
import { lesan, MongoClient } from "@deps";
import { categories, cities, files, provinces, reports, tags, users } from "@model";
import { functionsSetup } from "./src/mod.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://127.0.0.1:27017/";
const APP_PORT = Deno.env.get("APP_PORT") || 1406;
const ENV = Deno.env.get("ENV") || "development";

// 1. Initialize Lesan
export const coreApp = lesan();

// 2. Connect to MongoDB
const client = await new MongoClient(MONGO_URI).connect();
const db = client.db("gozaresh");
coreApp.odm.setDb(db);

// 3. Register models (call model factory functions)
export const file = files();
export const user = users();
export const province = provinces();
export const city = cities();
export const tag = tags();
export const category = categories();
export const report = reports();

// 4. Export commonly used Lesan functions
export const { setAct, setService, getAtcsWithServices } = coreApp.acts;
export const { selectStruct, getSchemas } = coreApp.schemas;

// 5. Setup all API routes
functionsSetup();

// 6. Start server
coreApp.runServer({
  port: Number(APP_PORT),
  typeGeneration: true, // Auto-generates TypeScript types
  playground: true, // Enable API playground
  staticPath: ["/uploads"], // Static file serving
  cors: ["http://localhost:3000"],
});
```

---

## Model Definition Pattern

Models are defined with three main components:

1. **Pure fields** - Simple data fields with validation using Superstruct
2. **Relations** - Relationships to other models
3. **Model registration** - Calling `coreApp.odm.newModel()`

### Complete Model Example

```typescript
// models/report.ts
import {
  defaulted,
  enums,
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  user_excludes,
  file_excludes,
  shared_relation_excludes,
  comment_excludes,
} from "./excludes.ts";
import { geoJSONStruct } from "./utils/geoJSONStruct.ts";

// 1. Define enums for restricted values
export const report_status_array = ["Pending", "Approved", "Rejected", "InReview"];
export const report_status_emums = enums(report_status_array);

// 2. Pure fields - basic data with validation
export const report_pure = {
  title: string(),
  description: string(),
  location: optional(geoJSONStruct("Point")), // GeoJSON Point
  address: optional(string()),
  status: defaulted(report_status_emums, "Pending"),
  priority: optional(enums(["Low", "Medium", "High"])),
  ...createUpdateAt, // Adds createdAt and updatedAt
};

// 3. Relations - connections to other models
export const report_relations = {
  reporter: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: false,
    excludes: user_excludes,
    relatedRelations: {
      // Reverse relation - what appears on the user model
      reports: {
        type: "multiple" as RelationDataType,
        limit: 100,
        excludes: comment_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  attachments: {
    schemaName: "file",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {}, // No reverse relation
  },
  tags: {
    schemaName: "tag",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: shared_relation_excludes,
    relatedRelations: {
      reports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: comment_excludes,
        sort: { field: "_id", order: "desc" as RelationSortOrderType },
      },
    },
  },
  category: {
    schemaName: "category",
    type: "single" as RelationDataType,
    optional: true,
    excludes: shared_relation_excludes,
    relatedRelations: {
      reports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: comment_excludes,
        sort: { field: "_id", order: "desc" as RelationSortOrderType },
      },
    },
  },
};

// 4. Register the model
export const reports = () => coreApp.odm.newModel("report", report_pure, report_relations);

// With indexes and excludes:
export const users = () =>
  coreApp.odm.newModel("user", user_pure, user_relations, {
    createIndex: {
      indexSpec: { email: 1 },
      options: { unique: true },
    },
    excludes: ["password"], // Fields excluded from API responses
  });
```

### Model Registration Options

```typescript
coreApp.odm.newModel(
  "modelName", // Model name (string)
  pureFields, // Object with field validations
  relations, // Object with relation definitions
  {
    // Optional configuration
    createIndex: {
      indexSpec: { fieldName: 1, geoField: "2dsphere" },
      options: { unique: true },
    },
    excludes: ["sensitiveField1", "sensitiveField2"], // Excluded from API responses
  },
);
```

---

## Relationship System

### Relation Types

**Single Relation** (one-to-one or many-to-one):

```typescript
category: {
  schemaName: "category",
  type: "single" as RelationDataType,
  optional: true,
  excludes: shared_relation_excludes,
  relatedRelations: {
    // Reverse: what appears on category model
    reports: {
      type: "multiple" as RelationDataType,
      limit: 50,
      excludes: comment_excludes,
      sort: { field: "_id", order: "desc" as RelationSortOrderType },
    },
  },
}
```

**Multiple Relations** (one-to-many or many-to-many):

```typescript
attachments: {
  schemaName: "file",
  type: "multiple" as RelationDataType,
  optional: true,
  excludes: file_excludes,
  relatedRelations: {},  // No reverse relation needed
}
```

### Relation Properties

| Property           | Type             | Description                               |
| ------------------ | ---------------- | ----------------------------------------- |
| `schemaName`       | string           | Target model name                         |
| `type`             | RelationDataType | "single" or "multiple"                    |
| `optional`         | boolean          | Whether relation is required              |
| `excludes`         | string[]         | Fields to exclude from response           |
| `relatedRelations` | object           | Reverse relations created on target model |
| `limit`            | number           | Max embedded docs (multiple relations)    |
| `sort`             | object           | Sort order for embedded docs              |

### Important Rules

1. **Never manually update relationships** - Always use `addRelation()` and `removeRelation()`
2. **Always use arrays for `_ids`** - Even for single relations: `_ids: [new ObjectId(id)]`
3. **Use `replace: true` carefully** - Deletes existing relations before adding new ones
4. **Separate pure updates from relation updates** - Use `findOneAndUpdate` for fields, `addRelation` for relations

---

## API Route Structure

Each API action follows a consistent three-file pattern:

### Directory Structure

```
src/[model]/[action]/
├── mod.ts              # Action setup (registers with Lesan)
├── [action].fn.ts      # Function implementation
└── [action].val.ts     # Validator definition
```

### 1. Validator (`[action].val.ts`)

Defines input validation and output projection:

```typescript
import { object, array, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { report_pure } from "@model";

export const addValidator = () => {
  // Extract fields that need special handling
  const { location, attachments, tags, category, ...basePure } = report_pure as Record<
    string,
    unknown
  >;

  return object({
    set: object({
      ...basePure,
      // Override complex fields
      location: optional(
        object({
          type: string(),
          coordinates: array(number()),
        }),
      ),
      attachments: optional(array(string())),
      tags: optional(array(string())),
      category: optional(string()),
    }),
    get: selectStruct("report", 1), // Output projection with depth 1
  });
};
```

### 2. Function (`[action].fn.ts`)

Implements the business logic:

```typescript
import { type ActFn, ObjectId } from "@deps";
import { coreApp, report } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;
  const { user }: MyContext = coreApp.contextFns.getContextModel() as MyContext;

  // Extract relations from set
  const { attachments, tags, category, ...rest } = set;

  return await report.insertOne({
    doc: rest, // Pure fields
    relations: {
      reporter: { _ids: user._id }, // Auto-set from context
      attachments: attachments
        ? {
            _ids: attachments.map((id: string) => new ObjectId(id)),
          }
        : undefined,
      tags: tags
        ? {
            _ids: tags.map((id: string) => new ObjectId(id)),
            relatedRelations: {
              reports: { replace: true },
            },
          }
        : undefined,
      category: category
        ? {
            _ids: new ObjectId(category),
            relatedRelations: {
              reports: { replace: true },
            },
          }
        : undefined,
    },
    projection: get,
  });
};
```

### 3. Setup (`mod.ts`)

Registers the action with Lesan:

```typescript
import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { addFn } from "./add.fn.ts";
import { addValidator } from "./add.val.ts";

export const addSetup = () =>
  coreApp.acts.setAct({
    schema: "report",
    fn: addFn,
    actName: "add",
    preAct: [
      setTokens, // Parse JWT tokens
      setUser, // Extract user from token
      grantAccess({
        // Authorization check
        levels: ["Manager", "Editor", "Ordinary"],
      }),
    ],
    validator: addValidator(),
    validationRunType: "create",
  });
```

---

## Common CRUD Patterns

### Add (Create)

```typescript
// Extract relations from set
const { relationField, ...rest } = set;

await model.insertOne({
  doc: rest,
  relations: {
    relationField: {
      _ids: [new ObjectId(relationField)],
      relatedRelations: { reverseRelation: true },
    },
  },
  projection: get,
});
```

### Get (Read One)

```typescript
const { _id, get } = body.details;

return await model
  .aggregation({
    pipeline: [{ $match: { _id: new ObjectId(_id) } }],
    projection: get,
  })
  .toArray();
```

### Gets (Read Many with Pagination)

```typescript
const { page, limit, ...filters } = body.details;
const pipeline: Document[] = [];

// Apply filters
status && pipeline.push({ $match: { status } });
categoryId && pipeline.push({ $match: { "category._id": categoryId } });
tagId && pipeline.push({ $match: { "tags._id": tagId } });

// Sort and paginate
pipeline.push({ $sort: { _id: -1 } });
pipeline.push({ $skip: (page - 1) * limit });
pipeline.push({ $limit: limit });

return await model.aggregation({ pipeline, projection: get }).toArray();
```

### Update (Pure Fields Only)

```typescript
const { _id, ...rest } = body.details;

const pureStruct = object(model_pure);
const updateObj: Partial<Infer<typeof pureStruct>> = {
  updatedAt: new Date(),
};

// Conditionally update fields
rest.title && (updateObj.title = rest.title);
rest.description && (updateObj.description = rest.description);
rest.status && (updateObj.status = rest.status);

return await model.findOneAndUpdate({
  filter: { _id: new ObjectId(_id as string) },
  update: { $set: updateObj },
  projection: get,
});
```

### Update Relations (Separate Endpoint)

```typescript
// Use addRelation/removeRelation for relationship changes
if (attachments) {
  await model.addRelation({
    filters: { _id: new ObjectId(_id) },
    relations: {
      attachments: {
        _ids: attachments.map((id) => new ObjectId(id)),
      },
    },
    projection: get,
    replace: true, // Replaces existing relations
  });
}

if (tags) {
  await model.addRelation({
    filters: { _id: new ObjectId(_id) },
    relations: {
      tags: {
        _ids: tags.map((id) => new ObjectId(id)),
        relatedRelations: {
          reports: { replace: true },
        },
      },
    },
    projection: get,
    replace: true,
  });
}

// Return updated document
return await model.findOne({
  filters: { _id: new ObjectId(_id) },
  projection: get,
});
```

### Remove (Delete)

```typescript
return await model.deleteOne({
  filter: { _id: new ObjectId(_id) },
  get,
  // hardCascade: true,  // Optional: cascade delete related docs
});
```

### Count

```typescript
const { filters } = body.details;
return await model.countDocument({ filter: filters || {} });
```

---

## Authorization & Context

### User Context Type Definition

```typescript
// utils/context.ts
import { type Infer, type LesanContenxt, object, type ObjectId } from "@deps";
import { user_pure } from "../models/user.ts";

type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } & B extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

const userPureObj = object(user_pure);
type UserPure = Infer<typeof userPureObj>;

export interface MyContext extends LesanContenxt {
  user: Merge<{ _id: ObjectId }, Partial<UserPure>>;
  isInFeatures: boolean;
  isInLevels: boolean;
}
```

### User Levels

```typescript
export const user_level_array = ["Ghost", "Manager", "Editor", "Ordinary"];
export const user_level_emums = enums(user_level_array);
```

### Grant Access Middleware

```typescript
// utils/grantAccess.ts
export const grantAccess = ({ levels, isOwn }: { levels?: UserLevels[]; isOwn?: boolean }) => {
  const checkAccess = () => {
    const { user }: MyContext = coreApp.contextFns.getContextModel() as MyContext;

    if (levels) {
      const levelIsInUser = levels.some((inLevel) => user.level === inLevel);
      if (levelIsInUser || user.level === "Ghost") {
        coreApp.contextFns.setContext({ isInLevels: true });
        return;
      } else {
        coreApp.contextFns.setContext({ isInLevels: false });
        return throwError("You cant do this");
      }
    }

    if (isOwn) {
      return;
    } else {
      throwError("You cant do this");
    }
  };

  return checkAccess;
};
```

### Accessing User Context

```typescript
import type { MyContext } from "@lib";
import { coreApp } from "../../../mod.ts";

const { user }: MyContext = coreApp.contextFns.getContextModel() as MyContext;
// user._id, user.level, user.email, etc.
```

### Set User Middleware

```typescript
// utils/setUser.ts
export const setUser = async () => {
  const {
    user: { _id },
  }: MyContext = coreApp.contextFns.getContextModel() as MyContext;

  const userPureProjection = coreApp.schemas.createProjection("user", "Pure");

  const foundedUser = await user.findOne({
    filters: { _id: new ObjectId(_id) },
    projection: userPureProjection,
  });

  !foundedUser && throwError("user not exist");

  coreApp.contextFns.setContext({ user: foundedUser });
};
```

---

## Validation Patterns

### Pure Fields with createUpdateAt

```typescript
// utils/createUpdateAt.ts
import { date, defaulted, optional } from "@deps";

export const createUpdateAt = {
  createdAt: optional(defaulted(date(), () => new Date())),
  updatedAt: optional(defaulted(date(), () => new Date())),
};

// Usage in models
import { createUpdateAt } from "@lib";

export const model_pure = {
  name: string(),
  description: optional(string()),
  ...createUpdateAt, // { createdAt: date(), updatedAt: date() }
};
```

### GeoJSON Validation

```typescript
// models/utils/geoJSONStruct.ts
import { array, literal, number, object, tuple } from "@deps";

const Coordinate = tuple([number(), number()]);

export const geoJSONStruct = (type: GeoJSONGeometryType) => object({
  type: literal(type),
  coordinates: getCoordinatesSchema(type),
});

// Usage in models
location: optional(geoJSONStruct("Point")),
// Types: "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"
```

### SelectStruct for Projections

```typescript
import { selectStruct } from "../../../mod.ts";

// Depth 1: Include immediate relations
get: selectStruct("report", 1);

// Depth 2: Include nested relations
get: selectStruct("report", 2);

// Custom depth per relation
get: selectStruct("report", { reporter: 1, tags: 2 });
```

### Application-Level Filtering

```typescript
// ❌ Don't expose MongoDB operators
{ $gte: date, $regex: pattern }

// ✅ Use application-specific parameters
{ status: "Approved", categoryId: id, tagId: id }
```

---

## Excludes Pattern

Centralized in `models/excludes.ts` to prevent circular dependencies:

```typescript
/**
 * Centralized file for all model excludes to prevent circular dependencies
 */

// File model excludes
export const file_excludes: string[] = ["createdAt", "updatedAt", "size"];

// User model excludes
export const user_excludes: string[] = [
  "createdAt",
  "updatedAt",
  "father_name",
  "birth_date",
  "summary",
];

// Location model excludes
export const location_excludes: string[] = ["area", "center"];

// Shared relation model excludes
export const shared_relation_excludes: string[] = ["createdAt", "updatedAt", "description"];

// Comment model excludes
export const comment_excludes: string[] = ["createdAt", "updatedAt"];
```

---

## Shared Utilities

### createUpdateAt

```typescript
// utils/createUpdateAt.ts
export const createUpdateAt = {
  createdAt: optional(defaulted(date(), () => new Date())),
  updatedAt: optional(defaulted(date(), () => new Date())),
};
```

### Shared Relations

```typescript
// models/utils/sharedRelations.ts
export const shared_relation_pure = {
  name: string(),
  description: string(),
  color: optional(string()), // E.g., "#FF5733"
  icon: optional(string()), // E.g., "museum-icon.svg"
  ...createUpdateAt,
};

export const createSharedRelations = () => ({
  registrar: {
    schemaName: "user",
    type: "single" as RelationDataType,
    excludes: user_excludes,
    optional: true,
    relatedRelations: {},
  },
});
```

### Reusable Location Fields

```typescript
// models/utils/pureLocation.ts
export const pure_location = {
  name: string(),
  english_name: string(),
  area: geoJSONStruct("MultiPolygon"),
  center: geoJSONStruct("Point"),
  ...createUpdateAt,
};

// Usage in province/city models
export const province_pure = { ...pure_location };
```

---

## MongoDB Indexes

### 2dsphere Indexes for GeoJSON

```typescript
coreApp.odm.newModel("province", province_pure, province_relations, {
  createIndex: {
    indexSpec: {
      area: "2dsphere",
      center_location: "2dsphere",
    },
  },
});
```

### Unique Indexes

```typescript
coreApp.odm.newModel("user", user_pure, user_relations, {
  createIndex: {
    indexSpec: { email: 1 },
    options: { unique: true },
  },
  excludes: ["password"],
});
```

---

## API Request Format

All API calls use POST with this structure:

```json
{
  "service": "main",
  "model": "report",
  "act": "add",
  "details": {
    "set": {
      /* input data */
    },
    "get": {
      /* projection */
    }
  }
}
```

---

## Best Practices

1. **Atomic Operations**: Keep actions focused - one action, one responsibility
2. **Separate Concerns**: Pure field updates vs relation updates in different endpoints
3. **Type Safety**: Use TypeScript types from Lesan (`ActFn`, `RelationDataType`, etc.)
4. **Validation First**: Always define validators before implementing functions
5. **Projection Control**: Use `selectStruct` to control response depth
6. **Exclude Sensitive Data**: Use excludes arrays to prevent leaking sensitive fields
7. **Middleware Chain**: Use `preAct` for auth, token parsing, and access control
8. **Aggregation for Complex Queries**: Use MongoDB aggregation pipeline for filtering/sorting
9. **Replace with Caution**: Only use `replace: true` when you intend to delete existing relations
10. **Context for State**: Use `coreApp.contextFns.setContext()` to pass data between middleware and handlers
11. **Centralize Excludes**: Use `models/excludes.ts` to prevent circular dependencies
12. **Shared Patterns**: Extract common patterns to `models/utils/` (shared relations, location fields)
13. **Reusable Pagination**: Use the `pagination` utility from `@lib` instead of manually defining page/limit/skip
14. **Text Search**: Use MongoDB text indexes for full-text search instead of regex patterns for better performance
15. **Search Relevance**: When implementing text search, add `textScore` field and allow sorting by relevance

---

## Environment Variables

| Variable    | Default                      | Description               |
| ----------- | ---------------------------- | ------------------------- |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/` | MongoDB connection string |
| `APP_PORT`  | `1406`                       | Server port               |
| `ENV`       | `development`                | Environment mode          |

---

## Running the Application

### Development

```bash
cd back/
deno task bc-dev  # Auto-reload development
```

### Production

```bash
docker build --target production -t gozaresh-backend:production .
# Or via docker-compose from project root
docker-compose up --build
```

---

## Key Lesan Functions Reference

| Function                               | Purpose                               |
| -------------------------------------- | ------------------------------------- |
| `coreApp.odm.newModel()`               | Create a new data model               |
| `coreApp.odm.setDb()`                  | Set the database connection           |
| `coreApp.acts.setAct()`                | Register an API action                |
| `coreApp.schemas.selectStruct()`       | Generate projection schema            |
| `coreApp.schemas.createProjection()`   | Create projection for specific fields |
| `model.insertOne()`                    | Create a document with relations      |
| `model.findOne()`                      | Read a single document                |
| `model.find()`                         | Read multiple documents               |
| `model.findOneAndUpdate()`             | Update pure fields                    |
| `model.deleteOne()`                    | Delete a document                     |
| `model.countDocument()`                | Count matching documents              |
| `model.aggregation()`                  | Run aggregation pipeline              |
| `model.addRelation()`                  | Add relationships                     |
| `model.removeRelation()`               | Remove relationships                  |
| `coreApp.contextFns.getContextModel()` | Get request context                   |
| `coreApp.contextFns.setContext()`      | Set context data                      |

---

## Common TypeScript Types

```typescript
import {
  ActFn, // Function type for API actions
  RelationDataType, // "single" | "multiple"
  RelationSortOrderType, // "asc" | "desc"
  ObjectId, // MongoDB ObjectId
  Infer, // Type inference from validators
  Document, // MongoDB document type
} from "@deps";

import { MyContext } from "@lib"; // Custom context with user info
```
