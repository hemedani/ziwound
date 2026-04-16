# Ziwound Backend TODO.md

**Project**: Ziwound Backend – War Crimes Documentation System
**Goal**: Deno + Lesan backend with MongoDB for war crimes documentation, document management, and blog functionality
**Tech stack**: Deno + Lesan framework + MongoDB + JWT auth + File upload support

**Workflow rules for ZED IDE AI agent**:

- Always read `CONTINUE.md` first as your system prompt.
- Work **one step at a time** from this TODO.md.
- After finishing a step: mark it `[x]`, add any notes, then run the exact git commit procedure described in root QWEN.md.
- Never skip steps. Never use `git reset`.
- Update this TODO.md and commit after every single step.
- When stuck, ask for clarification in the ZED chat but do not proceed to next step.
- Use **Deno tasks** for all commands.
- Follow Lesan framework patterns and best practices from back/QWEN.md.

## Phase 1: Core Models (Already Complete)

- [x] User model (with roles: Ghost, Manager, Editor, Ordinary – JWT ready, bcrypt, unique email index)
- [x] File model (for attachments, type-based directory routing: images/videos/docs)
- [x] Tag model (with registrar relation, color, icon)
- [x] Province model (GeoJSON MultiPolygon area + Point center, 2dsphere indexes)
- [x] City model (with province relation, GeoJSON, 2dsphere indexes)
- [x] Category model (with registrar relation, color, icon)
- [x] Report model (title, description, attachments relation (multiple), tags relation (multiple), location (GeoJSON Point), status enum, priority, reporter relation, category relation)

## Phase 2: Auth & CRUD Acts (Already Complete)

- [x] Implement auth acts (register/login + secure JWT with 90-day expiry, bcrypt, HS512)
  - [x] user.login, user.registerUser, user.tempUser, user.getMe
  - [x] user.getUser, user.getUsers, user.addUser, user.updateUser, user.updateUserRelations, user.removeUser, user.countUsers, user.dashboardStatistic
- [x] Implement CRUD acts for Province, City, Tag, Category (add, get, gets, update, remove, count)
- [x] Implement Report CRUD acts (add, get, gets, update, updateRelations, remove, count)
  - [x] report.add (with attachments, tags, category relations)
  - [x] report.get, report.gets (with status/category/tag filters)
  - [x] report.update (pure fields), report.updateRelations (relations with replace)
  - [x] report.remove, report.count
- [x] Add file upload endpoint + static serving (file.uploadFile, file.getFiles)
- [x] Add CORS, MongoDB connection (CORS configured with multiple origins, static file serving)
- [x] Generate declarations/ for frontend type safety
- [x] Add API playground access (playground: true in mod.ts)

## Phase 3: Document Model Implementation

- [x] **Create Document Model Schema**
  - [x] Define Document model in `models/document.ts`
  - [x] Fields: title (string, required), description (string, optional), documentFiles (array of file references, multiple), report (single relation to Report)
  - [x] Add validator schemas with Zod-like syntax
  - [x] Add relations setup (each document belongs to one report; reports can have many documents)
  - [x] Add text indexes for search functionality
- [x] **Implement Document CRUD Acts**
  - [x] Create `src/document/add.ts` - Add new document
  - [x] Create `src/document/get.ts` - Get single document by ID
  - [x] Create `src/document/gets.ts` - Get multiple documents with pagination/filtering
  - [x] Create `src/document/update.ts` - Update document
  - [x] Create `src/document/updateRelations.ts` - Update document relations (link to report)
  - [x] Create `src/document/remove.ts` - Delete document
  - [x] Create `src/document/count.ts` - Count documents
- [ ] **Add Document-Report Relation Management**
  - [x] Implement addRelation functionality between Documents and Reports
  - [ ] Implement removeRelation functionality
  - [ ] Add specialized gets endpoint that includes related documents
  - [ ] Add specialized gets endpoint that includes related reports
- [ ] **File Upload Support for Documents**
  - [ ] Extend file upload to support document file types (PDF, DOC, DOCX, XLS, XLSX, TXT, etc.)
  - [ ] Add file type validation
  - [ ] Add file size limits configuration
  - [ ] Update File model to track document file types
- [ ] **Generate Type Declarations**
  - [ ] Run type generation for frontend integration
  - [ ] Verify declarations/ includes Document model types
  - [ ] Test type safety with example queries

## Phase 4: Blog Post Model Implementation

- [ ] **Create BlogPost Model Schema**
  - [ ] Define BlogPost model in `models/blogPost.ts`
  - [ ] Fields: title (string, required), slug (string, unique, required), content (string, required - markdown/HTML), author relation (User reference), coverImage (File reference, optional), isPublished (boolean, default false), tags relation (multiple), publishedAt (Date, optional)
  - [ ] Add validator schemas with Zod-like syntax
  - [ ] Add relations setup (author, coverImage, tags)
  - [ ] Add text indexes for full-text search on title and content
  - [ ] Add unique index on slug field
- [ ] **Implement BlogPost CRUD Acts**
  - [ ] Create `src/blogPost/add.ts` - Add new blog post
  - [ ] Create `src/blogPost/get.ts` - Get single blog post by ID or slug
  - [ ] Create `src/blogPost/gets.ts` - Get multiple blog posts with pagination/filtering
    - [ ] Add filter by isPublished status
    - [ ] Add filter by author
    - [ ] Add filter by tags
    - [ ] Add text search functionality
    - [ ] Add sorting by publishedAt, createdAt, updatedAt
  - [ ] Create `src/blogPost/update.ts` - Update blog post
  - [ ] Create `src/blogPost/updateRelations.ts` - Update blog post relations (tags)
  - [ ] Create `src/blogPost/remove.ts` - Delete blog post
  - [ ] Create `src/blogPost/count.ts` - Count blog posts
- [ ] **Add Advanced Blog Features**
  - [ ] Add publish/unpublish action endpoints
  - [ ] Add featured posts endpoint
  - [ ] Add posts by slug endpoint (for SEO-friendly URLs)
  - [ ] Add related posts endpoint (based on tags/category)
- [ ] **Generate Type Declarations**
  - [ ] Run type generation for frontend integration
  - [ ] Verify declarations/ includes BlogPost model types
  - [ ] Test type safety with example queries

## Phase 5: War Crimes Exploration Backend Support

- [ ] **Advanced Report Filtering for Exploration**
  - [ ] Enhance report.gets with advanced filters:
    - [ ] Date range filtering (createdAt, incident date if available)
    - [ ] Geospatial filtering (within bounding box, radius from point)
    - [ ] Category and tag filtering
    - [ ] Status filtering (only approved/published reports)
    - [ ] Severity/priority filtering
  - [ ] Add sorting options (date, relevance, location)
- [ ] **Geospatial Queries**
  - [ ] Add geospatial query endpoints for map-based exploration
  - [ ] Support GeoJSON queries for regions and boundaries
  - [ ] Add proximity search (reports near a location)
  - [ ] Add clustering support for map markers (if needed)
- [ ] **Aggregation & Analytics Endpoints**
  - [ ] Add statistics endpoint (total reports by status, category, location, date)
  - [ ] Add timeline aggregation (reports over time periods)
  - [ ] Add geographic distribution data
  - [ ] Add tag/category distribution
- [ ] **Export Functionality**
  - [ ] Add CSV export endpoint for reports
  - [ ] Add PDF export endpoint for individual reports with documents
  - [ ] Add bulk export functionality for admin users
  - [ ] Add data anonymization for sensitive fields in exports

## Phase 6: Backend Audit & Bug Fixes

- [ ] Fix identified bugs:
  - [ ] Fix: `getUsers` and `countUsers` use `levels` instead of `level` field name
  - [ ] Fix: `category.update` doesn't update `color`/`icon` fields
  - [ ] Fix: CORS config has malformed URLs with double `http://`
  - [ ] Fix: `getUsers` references "Examiner" level but it's not defined in user_level_array
  - [ ] Fix: File model uses `mimType` instead of `mimeType` (typo)
- [ ] Add authentication to public endpoints:
  - [ ] Province/City/Tag/Category acts should have proper auth
  - [ ] Review all endpoints for proper authorization
- [ ] Security audit:
  - [ ] Review file upload limits and validation
  - [ ] Add rate limiting if needed
  - [ ] Review JWT token security
  - [ ] Audit MongoDB injection vulnerabilities
- [ ] Performance optimization:
  - [ ] Add database indexes where needed
  - [ ] Optimize slow queries
  - [ ] Add caching if needed

## Phase 7: Testing & Production

- [ ] Test all new models and endpoints locally with `deno task bc-dev`
- [ ] Write integration tests for Document model
- [ ] Write integration tests for BlogPost model
- [ ] Test relation management (add/remove relations)
- [ ] Test file upload for document files
- [ ] Test advanced filtering and geospatial queries
- [ ] Test export functionality
- [ ] Docker build testing
- [ ] Production deployment preparation

**Known Issues** (from code review):

- ⚠️ Bug: `getUsers` and `countUsers` use `levels` instead of `level` field name
- ⚠️ Bug: `category.update` doesn't update `color`/`icon` fields
- ⚠️ Bug: CORS config has malformed URLs with double `http://`
- ⚠️ Bug: `getUsers` references "Examiner" level but it's not defined in user_level_array
- ℹ️ File model uses `mimType` instead of `mimeType` (typo)
- ⚠️ Province/City/Tag/Category acts have NO auth (all public)

**How to proceed**: Open `CONTINUE.md` in ZED, tell the AI agent: "Continue with next unchecked step from TODO.md". After each step the agent must update TODO.md and commit.
