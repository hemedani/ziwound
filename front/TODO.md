# Ziwound Frontend TODO.md

**Project**: Ziwound Frontend – War Crimes Documentation System
**Goal**: Beautiful, accessible, multi-language Next.js 16 frontend with shadcn/ui components, war crimes exploration page, blog section, and document management
**Tech stack**: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + next-intl + Zustand + React Hook Form + Zod

**New Features**:

- War Crimes Exploration Page (search, filter, map view, timeline)
- Blog Section (articles, news, updates with rich text display)
- Document Management (upload, link to reports, display)

**Workflow rules for ZED IDE AI agent**:

- Always read `CONTINUE.md` first as your system prompt.
- Work **one step at a time** from this TODO.md.
- After finishing a step: mark it `[x]`, add any notes, then run the exact git commit procedure described in root QWEN.md.
- Never skip steps. Never use `git reset`.
- Update this TODO.md and commit after every single step.
- When stuck, ask for clarification in the ZED chat but do not proceed to next step.
- Use **pnpm** for all commands.
- Use **Server Actions** for all backend communication (never direct client fetch).
- All UI must be beautiful, accessible, and production-ready with shadcn/ui.

## Phase 1: Setup & Configuration (Beginning – do these first)

- [x] Next.js 16 app scaffolded with TypeScript, Tailwind v4, App Router
- [x] Install core dependencies: next-intl, zustand, react-hook-form, zod, jose, next-themes
- [x] Install Radix UI primitives, class-variance-authority, lucide-react, framer-motion
- [x] Configure next-intl (fa/en, RTL/LTR, middleware, routing.ts, messages/fa.json + en.json)
- [x] Create folder structure: src/app, src/components, src/stores, src/actions, src/types/declarations
- [x] Setup Zustand auth store with JWT cookie handling
- [x] Setup server actions for auth (login, register, getMe, logout)
- [x] Setup server actions for reports (createReport, getMyReports)
- [x] Create public/ assets and i18n folder
- [x] Create multi-stage Dockerfile (dev + prod)
- [x] Setup shadcn/ui with RTL support
  - [x] Configure components.json with `"rtl": true`
  - [x] Create cn() utility function in src/lib/utils.ts
  - [x] Add base UI components: Button, Input, Textarea, Label, Card
  - [x] Update globals.css with shadcn/ui theme variables
- [x] Copy backend type declarations to src/types/declarations/

## Phase 2: Core UI Components (Build shadcn/ui component library)

- [x] Add more shadcn/ui components as needed:
  - [x] Dialog/Modal (for confirmations, forms)
  - [x] Toast/Notification (for success/error messages)
  - [x] Select (for dropdowns: tags, categories, status)
  - [x] Checkbox (for multi-select tags, filters)
  - [x] Tabs (for admin panel sections)
  - [x] Table (for reports/users lists in admin)
  - [x] Dropdown Menu (for user menu, actions)
  - [x] Avatar (for user profiles)
  - [x] Badge (for tags, status indicators)
  - [x] Form (React Hook Form integration with shadcn/ui)
  - [x] Popover (for emoji picker)
  - [x] Emoji Picker (emoji-picker-react)
  - [ ] File Upload component
  - [ ] Loading/Spinner component
- [x] Create reusable form components:
  - [x] FormField (with label, input, error message)
  - [x] FileUploadField (with preview for images)
  - [x] TagSelector (multi-select with chips)
  - [x] LocationPicker (map or address input)
- [x] Create layout components:
  - [x] Header (with language switcher, theme toggle, auth buttons)
  - [x] Footer (simple, multi-lang)
  - [x] Sidebar (for admin panel)
  - [ ] Navigation (public site)
- [x] Theme configuration:
  - [x] Dark mode with next-themes
  - [x] Light mode (default)
  - [x] System preference detection
  - [x] Smooth theme transitions

## Phase 3: Public User Pages (Multi-language)

- [x] **Landing Page** (`/[locale]/`)
  - [x] Hero section with app description
  - [x] Features overview (simple, secure, multi-language)
  - [x] Login/Register CTA buttons
  - [x] Beautiful, welcoming design
- [x] **Login Page** (`/[locale]/login`)
  - [x] Email + password form
  - [x] Zod validation
  - [x] Error handling (wrong credentials)
  - [x] Loading states
  - [x] Link to register page
  - [x] Redirect to home after login
- [x] **Register Page** (`/[locale]/register`)
  - [x] Name, email, password, confirm password form
  - [x] Zod validation (password strength, email format)
  - [x] Error handling (duplicate email)
  - [x] Loading states
  - [x] Link to login page
  - [x] Auto-login after registration
- [x] **Report Submission Page** (`/[locale]/reports/new`)
  - [x] Title field (required)
  - [x] Description textarea (required, with character count)
  - [x] File upload (multiple files, with preview, drag & drop)
  - [x] Tags multi-select (searchable, with chips)
  - [x] Category select (dropdown)
  - [x] Location picker (map with pin placement OR address input)
  - [x] Priority selector (low, medium, high)
  - [x] Status (auto-set to "pending")
  - [x] Zod validation for all fields
  - [x] Loading states during submission
  - [x] Success/error toasts
  - [x] Redirect to my reports after submission
  - [x] Simple, elegant, intuitive design
- [x] **My Reports Page** (`/[locale]/reports`)
  - [x] List of user's reports (cards or table)
  - [x] Each report shows: title, status badge, date, category
  - [x] Filter by status (pending, approved, rejected)
  - [x] Filter by category
  - [x] Pagination or infinite scroll
  - [x] Empty state (no reports yet)
  - [x] Link to create new report
  - [x] Click to view report details
- [x] **Report Detail Page** (`/[locale]/reports/[id]`)
  - [x] Full report information
  - [x] Attachments (downloadable, image preview)
  - [x] Tags displayed as badges
  - [x] Category, location, priority
  - [x] Status badge with color coding
  - [x] Submission date
  - [ ] Comments/reviews section (if applicable)

## Phase 4: Admin Panel (`/admin/*` – no locale prefix)

- [x] **Admin Layout**
  - [x] Sidebar navigation (Dashboard, Reports, Users, Tags, Categories, Files)
  - [x] Admin header with user menu
  - [x] Role-based access check (redirect if not admin)
  - [x] Dark theme by default (optional toggle)
- [x] **Admin Dashboard** (`/admin/dashboard`)
  - [x] Statistics cards (total reports, users, pending reports, approved)
  - [x] Recent reports list
  - [x] Charts/graphs (reports over time, by category, by status)
  - [x] Quick actions (approve pending, view users, etc.)
- [ ] **Reports Management** (`/admin/reports`)
  - [x] Data table with all reports
  - [x] Columns: title, reporter, category, status, priority, date, actions
  - [x] Filter by status, category, priority, date range
  - [x] Search by title or reporter
  - [x] Sort by any column
  - [x] Pagination
  - [x] Bulk actions (approve, reject, delete)
  - [x] Row actions: view, edit, approve, reject, delete
  - [x] Export to CSV/Excel
  - [x] View report detail modal/page
- [x] **Users Management** (`/admin/users`)
  - [x] Data table with all users
  - [x] Columns: name, email, role, level, reports count, date, actions
  - [x] Filter by role/level
  - [x] Search by name or email
  - [x] Sort by any column
  - [x] Pagination
  - [x] Actions: view, edit role/level, deactivate, delete
  - [x] Add new user modal
- [x] **Tags Management** (`/admin/tags`)
  - [x] List/grid of all tags
  - [x] Columns: name, color, icon, description, actions
  - [x] Search by tag name
  - [x] Sort by any column
  - [x] Pagination
  - [x] Delete tag (with confirmation)
  - [x] Add new tag (name, color picker, emoji icon selector)
  - [x] Edit tag
- [x] **Categories Management** (`/admin/categories`)
  - [x] List/grid of all categories
  - [x] Columns: name, color, icon, description, actions
  - [x] Add new category (name, color picker, emoji icon selector)
  - [x] Edit category
  - [x] Delete category (with confirmation)
- [x] **Files Management** (`/admin/files`)
  - [x] List of all uploaded files
  - [x] Columns: filename, type, size, uploaded by, date, actions
  - [x] Filter by type (images, videos, docs)
  - [x] Search by filename (Backend text search integrated)
  - [x] Sort by any column (Backend sorting integrated)
  - [ ] Delete file (with confirmation)
  - [x] Preview images/videos

## Phase 5: Internationalization (Complete all 9 languages)

- [x] Add translation files for all languages:
  - [x] fa.json (Persian – default, RTL) ✅ started
  - [x] en.json (English – LTR) ✅ started
  - [x] ar.json (Arabic – RTL) ✅
  - [x] zh.json (Chinese – LTR) ✅
  - [x] pt.json (Portuguese – LTR) ✅
  - [x] es.json (Spanish – LTR) ✅
  - [x] nl.json (Dutch – LTR) ✅
  - [x] tr.json (Turkish – LTR) ✅
  - [x] ru.json (Russian – LTR) ✅
- [x] Translate all pages:
  - [x] Landing page
  - [x] Login/Register pages
  - [x] Report submission page
  - [x] My Reports page
  - [x] Report detail page
  - [x] Admin panel (all pages)
- [x] Translate all UI elements:
  - [x] Form labels, placeholders, error messages
  - [x] Button texts
  - [x] Navigation labels
  - [x] Toast notifications
  - [x] Table headers
  - [x] Modal titles and content
- [x] Language switcher component (header/footer)
- [x] Test RTL layouts thoroughly (fa, ar)
- [x] Test LTR layouts thoroughly (en, zh, pt, es, nl, tr, ru)

## Phase 6: PWA & Polish

- [x] Install next-pwa
- [x] Configure service worker
  - [x] Cache static assets
  - [x] Offline fallback page
  - [x] Manifest.json with app metadata
- [x] App icons (multiple sizes)
- [ ] Test PWA functionality
- [x] Mobile responsiveness audit:
  - [x] All pages work perfectly on mobile (320px+)
  - [x] Touch-friendly buttons and interactions
  - [x] Mobile-optimized forms (keyboard handling)
  - [x] Hamburger menu for navigation
- [x] Loading states:
  - [x] Skeleton loaders for all data lists
  - [x] Loading spinners for async actions
  - [x] Optimistic updates where appropriate
- [x] Error handling:
  - [x] Network error handling
  - [x] Server error handling
  - [x] User-friendly error messages
  - [x] Retry mechanisms
- [x] Accessibility audit:
  - [x] Keyboard navigation
  - [x] Screen reader support
  - [x] Color contrast (WCAG AA)
  - [x] Focus indicators
  - [x] ARIA labels where needed

## Phase 7: Testing & Production Readiness

- [x] Form validation testing (Zod schemas)
- [x] Auth flow testing (login, register, logout, session)
- [x] Server actions error handling
- [x] Edge cases handling:
  - [x] Empty states
  - [x] No data states
  - [x] Error states
  - [x] Loading states
- [x] Security audit:
  - [x] XSS prevention
  - [x] CSRF protection
  - [x] Input sanitization
  - [x] Secure cookie handling
  - [x] Rate limiting on forms
- [x] Performance optimization:
  - [x] Image optimization (next/image)
  - [x] Code splitting
  - [x] Lazy loading heavy components
  - [x] Font optimization
- [x] Final cleanup:
  - [x] Remove unused code/imports
  - [x] Remove console.logs
  - [x] Type safety check (no `any`)
  - [x] Lint and format check
- [x] Docker Compose testing
- [x] Production build test
- [x] Deployment preparation (env vars, ports, etc.)

## Phase 8: Document Management Implementation

- [x] **Document Server Actions**
  - [x] Create `src/app/actions/document/add.ts`
  - [x] Create `src/app/actions/document/get.ts`
  - [x] Create `src/app/actions/document/gets.ts`
  - [x] Create `src/app/actions/document/update.ts`
  - [x] Create `src/app/actions/document/remove.ts`
  - [x] Create `src/app/actions/document/updateRelations.ts`
- [x] **Admin Panel - Document Management**
  - [x] Add Documents to admin sidebar navigation
  - [x] Create `/admin/documents` page with document list
  - [x] Add data table with columns: title, type, linked reports, date, actions
  - [x] Add search and filtering (by type, linked reports)
  - [x] Add document upload modal/form
  - [x] Add document edit modal with report linking interface
  - [x] Add document delete action with confirmation
  - [x] Add document preview functionality
- [x] **Report Integration**
  - [x] Update report submission page to allow document uploads/links
  - [x] Update report detail page to show associated documents
  - [x] Add document upload section in report edit form
  - [x] Display documents as downloadable files with preview icons
- [x] **Public Document Access** (if approved by admin)
  - [x] Create optional public document listing page
  - [x] Add document download with proper permissions check
  - [x] Display document metadata and linked reports

## Phase 9: Dashboard Pages Update with New Document and Report Models

- [x] Add language field to Report model and update API usage
- [x] **Update Server Actions to Use Lesan Framework**
  - [x] Update `src/app/actions/report/actions.ts` to use the standard Lesan action pattern from QWEN.md
  - [x] Update `src/app/actions/report/gets.ts` to use Lesan API
  - [x] Update `src/app/actions/report/get.ts` to use Lesan API
  - [x] Ensure all report actions follow the pattern: cookieStore, token, result with service, model, act, details
- [x] **Update Dashboard Pages to Use New Models**
  - [x] Update `src/app/[locale]/(dashboard)/reports/new/page.tsx` to use updated createReport action and match reportSchema
  - [x] Update `src/app/[locale]/(dashboard)/reports/my/page.tsx` to use updated getReports action and match reportSchema
  - [x] Update `src/app/[locale]/(dashboard)/reports/[id]/page.tsx` to fully align with reportSchema and documentSchema
  - [x] Ensure all interfaces in dashboard pages extend or match the schemas from declarations.ts
- [x] **Integrate Document Management in Dashboard**
  - [x] Update report creation to properly handle documents via the new Document model
  - [x] Ensure attachments in new report form create Document records
  - [x] Update report detail page to display documents correctly using documentSchema
- [x] **Test and Validate Dashboard Functionality**
  - [x] Test report creation with attachments (ensure documents are created)
  - [x] Test report listing and filtering
  - [x] Test report detail view with documents
  - [x] Ensure all pages work with the new Lesan API responses

## Phase 10: Blog Section Implementation

- [x] **Blog Server Actions**
  - [x] Create `src/app/actions/blogPost/add.ts`
  - [x] Create `src/app/actions/blogPost/get.ts` (by ID or slug)
  - [x] Create `src/app/actions/blogPost/gets.ts` (with pagination, filters, search)
  - [x] Create `src/app/actions/blogPost/update.ts`
  - [x] Create `src/app/actions/blogPost/updateRelations.ts`
  - [x] Create `src/app/actions/blogPost/remove.ts`
  - [x] Create `src/app/actions/blogPost/publish.ts` (publish/unpublish toggle)
- [x] **Public Blog Pages**
  - [x] Create `/[locale]/blog` listing page
    - [x] Blog post cards with cover image, title, excerpt, date, author, tags
    - [x] Search bar for blog posts
    - [x] Filter by tags/categories
    - [x] Pagination or infinite scroll
    - [ ] RSS feed link (optional)
  - [x] Create `/[locale]/blog/[slug]` individual post page
    - [x] Full blog post content with rich text rendering
    - [x] Title, author, date, tags display
    - [x] Related posts section (based on tags)
    - [ ] Share buttons (social media)
    - [ ] Comments section (if applicable)
- [x] **Blog Admin Panel**
  - [x] Add Blog to admin sidebar navigation
  - [x] Create `/admin/blog` page with blog post management
  - [x] Add data table with columns: title, author, status (draft/published), tags, date, actions
  - [x] Add search and filtering (by status, author, tags, date)
  - [x] Add blog post creation/editing with rich text editor
  - [x] Integrate rich text editor (TipTap)
    - [x] Headings, bold, italic, lists, links, images
    - [x] Quotes, tables
  - [x] Add cover image upload
  - [x] Add tag selection
  - [x] Add publish/unpublish toggle
  - [x] Add delete action with confirmation
- [x] **Blog UI Components**
  - [x] Create BlogPostCard component (inlined)
  - [x] Create BlogPostList component (inlined)
  - [x] Create BlogPostDetail component (inlined)
  - [x] Create RichTextRenderer component (via @tailwindcss/typography)
  - [x] Create BlogSearch component (inlined)
- [x] **Blog Translations**
  - [x] Add all blog-related translation keys to all 9 language files
  - [x] Translate blog UI elements (labels, buttons, placeholders, etc.)
  - [x] Test blog pages in RTL (fa, ar) and LTR (en, zh, etc.) layouts

## Phase 11: War Crimes Exploration Page

- [x] **War Crimes Server Actions** (extend existing report actions)
  - [x] Enhanced `src/app/actions/report/gets.ts` with advanced filters (already supported in backend declarations):
    - [x] Date range filtering (createdAtFrom/To)
    - [x] Geospatial filtering (nearLng/nearLat/maxDistance, bbox)
    - [x] Advanced category/tag filtering (categoryIds, tagIds)
    - [x] Severity/priority filtering (priority)
    - [x] Status filtering (status - Pending, Approved, Rejected, InReview)
  - [x] Create `src/app/actions/report/statistics.ts` for analytics
  - [x] Create `src/app/actions/report/export.ts` for CSV export
- [x] **War Crimes Exploration Page** (`/[locale]/war-crimes`)
  - [x] Create main exploration page layout
  - [x] Add dual view toggle: Map View / List View / Statistics View
  - [x] **List View**:
    - [x] Data cards with report listings
    - [x] Columns: title, category, priority, date, location
    - [x] Pagination
  - [x] **Map View**:
    - [x] Placeholder with report count display
    - [x] Reports with location data shown
    - [x] Integrate MapLibre GL / Leaflet for interactive map
    - [x] Display war crime reports as map markers
    - [x] Add marker clustering for dense areas
    - [x] Add popup on marker click with report preview
    - [x] Support map filters (bounding box selection)
  - [x] **Statistics View**:
    - [x] Statistics cards (total, by priority)
    - [x] Bar and Pie charts with Chart.js
  - [x] **Advanced Search & Filters Panel**:
    - [x] Text search input
    - [x] Date range picker (from/to)
    - [x] Category dropdown
    - [x] Tag multi-select
    - [x] Priority filter
    - [x] Status filter
    - [x] Filter reset button
    - [ ] Location filter (city, province, or map selection)
  - [ ] **Timeline View** (optional, advanced feature):
    - [ ] Add timeline component showing reports over time
    - [ ] Allow timeline navigation and filtering
  - [ ] **Export & Sharing**:
    - [ ] Add export button (CSV, PDF)
    - [ ] Add share link functionality
    - [ ] Add social media sharing buttons
- [x] **War Crimes Exploration UI Components**
  - [x] Create `WarCrimesFilters` component
  - [x] Create `WarCrimesList` component (list/grid view)
  - [x] Create `WarCrimesMap` component (lazy loaded)
  - [x] Create `WarCrimesStatistics` component (charts)
  - [ ] Create `WarCrimesTimeline` component
  - [ ] Create `WarCrimesExport` component (export buttons)
- [x] **War Crimes Translations**
  - [x] Add all war crimes exploration translation keys to fa.json
  - [ ] Add all war crimes exploration translation keys to all 9 language files
  - [x] Translate exploration UI elements (labels, buttons, placeholders, filters)
  - [ ] Test exploration page in RTL (fa, ar) and LTR (en, zh, etc.) layouts
- [x] **Navigation Integration**
  - [x] Add War Crimes link to main header navigation (desktop + mobile)
  - [x] Add warCrimes translation key to header section
  - [ ] Add War Crimes link to footer quick links

## Known Issues & Technical Debt

- [x] Check if all server actions properly handle errors
- [x] Verify JWT cookie handling is secure (httpOnly, secure flags)
- [x] Ensure all forms have proper loading states
- [x] Test all RTL layouts for alignment issues
- [x] Verify all translation keys exist in all language files

**How to proceed**: Open `CONTINUE.md` in ZED, tell the AI agent: "Continue with next unchecked step from TODO.md". After each step the agent must update TODO.md and commit.
