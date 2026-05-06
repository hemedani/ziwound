# Ziwound Project TODO.md
**Project**: Ziwound – War Crimes Documentation System
**Goal**: Secure multi-language web app for ordinary people to submit war crime reports and explore documented war crimes. Includes blog section for articles and updates. Advanced admin panel.
**Tech stack**: Exact same as yademan/Naghshe (Deno + Lesan backend, Next.js 16 frontend, MongoDB, Docker, multi-lang fa/en, JWT auth, etc.).
**New Features**: 
- War Crimes Exploration Page (search, filter, and explore documented war crimes)
- Blog Section (articles, news, and updates)
- Document Model (supporting documents linked to reports)
**Workflow rules for ZED IDE AI agent**:
- Always read `CONTINUE.md` first as your system prompt.
- Work **one step at a time** from this TODO.md.
- After finishing a step: mark it `[x]`, add any notes, then run the exact git commit procedure described in root AGENT.md.
- Never skip steps. Never use `git reset`.
- Update this TODO.md and commit after every single step.
- When stuck, ask for clarification in the ZED chat but do not proceed to next step.

## Phase 0: Project Skeleton (Beginning – do these first)
- [x] `git init` in root
- [x] Create `.gitignore` (standard for Deno + Next.js + Docker – ignore node_modules, .env*, uploads/, dist/, etc.)
- [x] Paste the exact root `AGENT.md` content I provided below into `AGENT.md` (if not already done)
- [x] Create folder `back/` (if not already done)
- [x] Paste the exact `back/AGENT.md` content I provided into `back/AGENT.md` (if not already done)
- [x] Create folder `front/` (if not already done)
- [x] Paste the exact `front/AGENT.md` content I provided into `front/AGENT.md` (if not already done)
- [x] Create `CONTINUE.md` in root with the exact content I provided below (if not already done)
- [x] Create empty `docker-compose.dev.yml` and `docker-compose.yml` (we will fill them later)
- [x] Create `.env.backend` and `.env.frontend` templates (copy structure from yademan if you have it locally, otherwise minimal placeholders)
- [x] Commit the skeleton with proper gitmoji commit (use the rule in AGENT.md)

## Phase 1: Backend Skeleton (Deno + Lesan)
- [x] In `back/` run `deno init` (or copy deno.json/deps.ts/mod.ts structure from yademan/back)
- [x] Install Lesan framework via deps.ts (exact version used in yademan)
- [x] Create `back/models/` folder + basic model utilities
- [x] Create `back/src/` folder + mod.ts entry point
- [x] Create `back/uploads/` folder for attachments
- [x] Define core models (one small step each):
  - [x] User model (with roles: Ghost, Manager, Editor, Ordinary – JWT ready, bcrypt, unique email index)
  - [x] File model (for attachments, type-based directory routing: images/videos/docs)
  - [x] Tag model (with registrar relation, color, icon)
  - [x] Province model (GeoJSON MultiPolygon area + Point center, 2dsphere indexes)
  - [x] City model (with province relation, GeoJSON, 2dsphere indexes)
  - [x] Category model (with registrar relation, color, icon)
  - [x] Report model (title, description, attachments relation (multiple), tags relation (multiple), location (GeoJSON Point), status enum, priority, reporter relation, category relation)
  - [ ] Document model (title, description, document files (multiple), multiple relations to Reports - each report can have several documents)
  - [ ] Blog Post model (title, content/slugs, author relation, cover image, publish status, tags, publication date)
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
- [x] Generate declarations/ for frontend type safety (declarations/selectInp.ts – 2128 lines)
- [x] Create Dockerfile for back (multi-stage: development + production)
- [ ] Test backend locally with `deno task bc-dev` (or equivalent)
- [x] Add API playground access (playground: true in mod.ts)

## Phase 2: Frontend Skeleton (Next.js 15)
- [x] In `front/` run `npx create-next-app@latest . --typescript --tailwind --app --eslint --yes` (or copy exact structure from yademan/front)
- [x] Install all exact dependencies from yademan/front (pnpm install)
  - [x] next-intl, zustand, react-hook-form, zod, jose, next-themes
  - [x] Radix UI primitives, class-variance-authority, lucide-react, framer-motion
- [x] Setup next-intl (fa/en, RTL/LTR, middleware, routing.ts, messages/fa.json + en.json)
- [ ] Setup PWA, dark theme, Tailwind config
- [x] Create folder structure: src/app, src/components (atomic), src/stores (Zustand), src/actions (server actions per model), src/types/declarations
- [x] Setup auth context + JWT cookie handling (server actions in actions/auth/)
- [x] Create public/ assets and i18n folder
- [x] Create Dockerfile for front (multi-stage: dev + prod)
- [x] Update docker-compose files for dev (direct port mapping: localhost:3000, localhost:1405)
- [x] Setup shadcn/ui components library with RTL support
  - [x] Configure components.json with RTL support
  - [x] Create cn() utility function
  - [x] Add base UI components: Button, Input, Textarea, Label, Card
  - [x] Update globals.css with shadcn/ui theme variables

**Session Notes (April 4, 2026)**:
- ✅ Removed Traefik routing from docker-compose files
- ✅ Replaced with direct port mapping (frontend: 3000, backend: 1405, mongo: 27017)
- ✅ Set up shadcn/ui with full RTL support
- ✅ Created frontend-specific TODO.md and CONTINUE.md in front/ folder

## Phase 3: Core User-Facing Pages (Multi-language)
- [ ] Public landing page (simple, multi-lang)
- [ ] Login / Register page (secure, multi-lang)
- [ ] Report submission page (simple form: title, description, attachments upload, tags (multi-select), location picker (address or map if you want), other fields – multi-lang, beautiful UI)
- [ ] My Reports page (user sees own reports)
- [ ] Use server actions for all API calls (never direct fetch from client)

## Phase 4: Advanced Admin Panel
- [ ] Protected admin routes (/admin – no locale prefix, role check)
- [ ] Dashboard overview
- [ ] Reports management (list, filter, view details, approve/reject, edit, delete, export)
- [ ] Users management
- [ ] Tags / Categories management
- [ ] File / Attachment management
- [ ] Beautiful, responsive, dark-theme admin UI (use same components style as yademan)

## Phase 5: Polish & Production
- [ ] Full i18n on all pages
- [ ] Responsive + mobile perfect
- [ ] Form validation (Zod + React Hook Form)
- [ ] Error handling & loading states
- [ ] Security audit (auth, file upload limits, rate limiting)
- [ ] Docker Compose full dev + prod setup
- [ ] Deploy-ready (update ports, env vars)
- [ ] Final tests + cleanup

## Phase 6: Extra (optional)
- [ ] Map integration for location selection (reuse MapLibre/Leaflet if desired)
- [ ] Notifications, advanced filtering, analytics, etc.

## Phase 7: Document Model Implementation (Backend + Frontend)
- [ ] **Backend - Document Model**
  - [ ] Create Document model schema (title, description, documentFiles (multiple), reportRelations (multiple))
  - [ ] Implement Document CRUD acts (add, get, gets, update, updateRelations, remove, count)
  - [ ] Add relation management between Documents and Reports (many-to-many)
  - [ ] Add file upload support for document files (PDF, DOC, DOCX, etc.)
  - [ ] Generate type declarations for frontend
- [ ] **Frontend - Document Management**
  - [ ] Create Document server actions (add, get, gets, update, remove)
  - [ ] Add Document management in admin panel (/admin/documents)
  - [ ] Add Document upload and linking interface in report creation/editing
  - [ ] Display associated documents in report detail view
  - [ ] Add Document list/exploration page for public (optional, if admin approves)

## Phase 8: Blog Section Implementation (Backend + Frontend)
- [ ] **Backend - Blog Post Model**
  - [ ] Create BlogPost model schema (title, slug, content, author relation, coverImage, isPublished, tags, publishedAt)
  - [ ] Implement BlogPost CRUD acts (add, get, gets, update, updateRelations, remove, count)
  - [ ] Add text search and full-text indexing for blog content
  - [ ] Add tag and category relations for blog posts
  - [ ] Generate type declarations for frontend
- [ ] **Frontend - Blog Section**
  - [ ] Create Blog server actions (add, get, gets, update, remove)
  - [ ] Create public blog listing page (/[locale]/blog)
  - [ ] Create individual blog post page (/[locale]/blog/[slug])
  - [ ] Add blog search and filtering functionality
  - [ ] Add blog management in admin panel (/admin/blog)
  - [ ] Add rich text editor for blog content creation (e.g., TipTap, Quill, or similar)
  - [ ] Translate all blog UI elements to all 9 languages

## Phase 9: War Crimes Exploration Page
- [ ] **Frontend - War Crimes Exploration**
  - [ ] Create War Crimes exploration page (/[locale]/war-crimes)
  - [ ] Implement advanced search interface (by location, date range, category, tags, severity)
  - [ ] Add interactive map view showing reported war crimes (MapLibre GL/Leaflet)
  - [ ] Add list/grid view with filters and sorting
  - [ ] Add timeline view of war crimes by date
  - [ ] Implement sharing and export functionality
  - [ ] Add statistics and data visualization (charts, graphs)
  - [ ] Translate all exploration UI elements to all 9 languages
- [ ] **Backend Support**
  - [ ] Add specialized gets endpoint with advanced filtering for war crimes
  - [ ] Add geospatial queries for map-based exploration
  - [ ] Add aggregation endpoints for statistics and analytics
  - [ ] Add export functionality (CSV, PDF, etc.)

**Backend Audit Notes** (from code review):
- ⚠️ Missing Report model (core feature – next priority)
- ⚠️ Bug: `getUsers` and `countUsers` use `levels` instead of `level` field name
- ⚠️ Bug: `category.update` doesn't update `color`/`icon` fields
- ⚠️ Bug: CORS config has malformed URLs with double `http://`
- ⚠️ Bug: `getUsers` references "Examiner" level but it's not defined in user_level_array
- ⚠️ Province/City/Tag/Category acts have NO auth (all public)
- ℹ️ File model uses `mimType` instead of `mimeType` (typo)
- ℹ️ 38 acts total implemented across 5 schemas (user, file, province, city, tag, category)
- ℹ️ No Dockerfile yet in back/

**How to proceed**: Open `CONTINUE.md` in ZED, tell the AI agent: "Continue with next unchecked step from TODO.md". After each step the agent must update TODO.md and commit.
