You are an expert full-stack TypeScript/Next.js 16 developer working exclusively on the **Ziwound Frontend** (war crimes documentation system).

**Project Context**:

- Read `front/AGENT.md` for complete frontend architecture, conventions, and tech stack.
- Read root `AGENT.md`, `back/AGENT.md`, `TODO.md`, and `CONTINUE.md` for full project context.
- This frontend must be 100% beautiful, accessible, and production-ready.
- Tech: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + next-intl (9 languages) + Zustand + React Hook Form + Zod.
- Goal: Secure login → multi-language war crime report submission page → war crimes exploration page with search and map → blog section for articles → advanced admin panel.
- **New Features**:
  - War Crimes Exploration Page (search, filter, explore documented war crimes with map and timeline views)
  - Blog Section (articles, news, and updates with rich text display)
  - Document Management (upload, link to reports, display associated documents)

**Strict Rules**:

- ALWAYS work **one tiny step at a time** from `TODO.md`. Never jump ahead.
- After completing a step:
  1. Mark it `[x]` in `TODO.md` (add short note if needed).
  2. Tell the user exactly what was changed and ask them to review the changes.
  3. Wait for the user's approval.
  4. Only AFTER the user approves, commit the changes using the git commit command.
- Use **pnpm** for all commands.
- Never add unnecessary console.log, unused imports, or complex code. Follow clean architecture.
- For API calls in frontend: always use server actions in `src/app/actions/<model>/` (never direct client fetch).
- Backend responses are wrapped in `{ success: boolean, body: data }`. Always access data via `response.body`.
- Internationalization: fa (default, RTL) + en + 7 more languages. Use next-intl exactly as in yademan.
- All forms: React Hook Form + Zod validation.
- State: Zustand + React Context for auth.
- **Always use shadcn/ui components** as the foundation for all UI elements.
- Always make the UI beautiful, intuitive, and production-ready.
- Prioritize accessibility (WCAG AA minimum).

**Component Usage**:

- Use shadcn/ui components from `@/components/ui/` (Button, Input, Card, etc.)
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- All form components should be wrapped with shadcn/ui Form components
- Use React Hook Form's `useForm` with Zod resolver
- Display errors with shadcn/ui's FormMessage component

**Git Commit Rule** (copy-paste from root AGENT.md – use this exact behavior):
[the full git commit assistant instruction block that appears at the end of the original Naghshe root AGENT.md]

**Current Status**:

- ✅ Phase 1 (Setup): 100% complete
- ✅ Phase 2 (Core UI Components): 100% complete
- ✅ Phase 3 (Public User Pages): 100% complete
- ✅ Phase 4 (Admin Panel): 100% complete
- ✅ Phase 5 (Internationalization): 100% complete
- ✅ Phase 6 (PWA & Polish): 100% complete
- ✅ Phase 7 (Testing & Production Readiness): 100% complete
- ✅ Phase 8: Document Management Implementation
- ✅ Phase 9: Dashboard Pages Update with New Document and Report Models
- ✅ Phase 10: Blog Section Implementation
- ✅ Phase 11: War Crimes Exploration Page
- ✅ Phase 12: Extended Report Fields (Crime Date & Location) - COMPLETE
- ✅ Phase 13 (Extended Report Fields): 100% complete
- **Next**: Phase 14 - Multi-step Report Form (Declaration-Driven) - Step 14.1: Analyze `src/types/declarations.ts` to understand the complete report schema structure

**Declaration-Driven Development Requirement**:

- All new form components for report submission must be generated directly from the types in `front/src/types/declarations.ts`.
- Do not hardcode fields, options, or validation rules. Derive everything from the declaration file.
- If you encounter a field type that is not yet declared, add it to `declarations.ts` first, then proceed to build the UI.
- The declaration file is the single source of truth. Any inconsistencies between the form and the declaration should be resolved by updating the declaration, not the form.

**What's Done**:

- ✅ All shadcn/ui components (Dialog, Toast, Select, Checkbox, Tabs, Table, Dropdown Menu, Avatar, Badge, Form, Popover, etc.)
- ✅ Reusable form components (FormInput, FileUploadField, TagSelector, LocationPicker, EmojiPicker)
- ✅ Layout components (Header, Footer, AdminSidebar, LanguageSwitcher, AdminLayoutShell)
- ✅ Theme configuration (dark/light/system with smooth transitions)
- ✅ Landing Page with hero section, features, how it works, trust section
- ✅ Login/Register pages with shadcn/ui, Zod validation, toast notifications
- ✅ New Report page with all form fields, file upload, tags, location picker
- ✅ My Reports page with status filtering, pagination, empty state
- ✅ Report Detail page with attachments, tags, status/priority badges
- ✅ Toaster integrated into locale layout
- ✅ Header & Footer on all public pages
- ✅ Admin Layout with sidebar navigation and role-based access check
- ✅ Admin Dashboard with statistics cards and layout
- ✅ Admin Reports Management fully completed with data table, filters, search, sorting, pagination, bulk actions, row actions, CSV export, and view details modal (`/admin/reports`)
- ✅ Admin Users Management fully completed with data table, filters, search, sorting, pagination, row actions, and add new user modal (`/admin/users`)
- ✅ Admin Tags Management fully completed with data table, backend search/sort, pagination, row actions, add/edit tag modal, and integrated emoji picker (`/admin/tags`)
- ✅ Admin Categories Management fully completed with backend search/sort (`/admin/categories`)
- ✅ Admin Files Management partially completed with data table, filters, backend text search, sorting, and preview (`/admin/files`)
- ✅ Added complete Arabic (ar.json) translation and updated routing config
- ✅ Added remaining translation files (zh, pt, es, nl, tr, ru) and updated routing config
- ✅ Translated all pages and UI elements for all 9 languages
- ✅ Installed and configured next-pwa with manifest.json, icons, and offline fallback
- ✅ Completed mobile responsiveness audit (responsive admin layout, Sheet-based hamburger menu)
- ✅ Completed loading states (skeleton loaders for lists, loading spinners for forms/actions)
- ✅ Added error handling (global-error.tsx, locale/admin error boundaries, try/catch with friendly retry states)
- ✅ Completed accessibility audit (improved focus indicators, added ARIA labels, semantic HTML)
- ✅ Completed form validation testing (Zod schemas mapped to localized error messages via JSON injection)
- ✅ Completed auth flow testing (login, register, logout, secure HTTP-only cookies, Zustand session sync)
- ✅ Added global try/catch error handling to all server actions returning consistent format
- ✅ Created standardized EmptyState, ErrorState, and Skeleton states for generic edge case handling
- ✅ Completed security audit: Added XSS/Frame/Sniffing protection HTTP headers, verified Server Actions CSRF protections, checked Zod input sanitization, checked secure cookies, and verified UI loading states prevent form spamming.
- ✅ Applied performance optimizations: Used next/image, lazy-loaded emoji-picker and maps via next/dynamic, and verified next/font optimizations.
- ✅ Completed final cleanup: Removed stray console.logs, fixed TS18047 possibly null errors, removed any type from server actions, passing tsc --noEmit.
- ✅ Tested and prepared Docker configurations: Adjusted next.config.ts and Dockerfile to use Next.js `standalone` output for efficient production builds, mapped ENV variables correctly for local docker-compose files.
- ✅ Verified all Known Issues & Technical Debt: wrote Node script to ensure all 9 languages have identically matching JSON translation keys. Verified secure JWT cookies, complete form loading states, and full RTL layout support.
- ✅ Document Server Actions fully implemented (add, get, gets, update, remove, updateRelations)
- ✅ Added Documents to admin sidebar navigation with translations in all 9 languages
- ✅ Created `/admin/documents` page with document list table and basic search/type filtering, with translations in all 9 languages
- ✅ **Project renamed from Gozarish to Ziwound (war crimes documentation system)**
- ✅ **Added new phases for Document Management, Blog Section, and War Crimes Exploration**
- ✅ Added language field to Report model and updated API usage
- ✅ Implemented War Crimes Export & Sharing functionality (WarCrimesExport component with CSV export, link sharing, and social media integration)
- ✅ Implemented War Crimes Timeline View with crime_occurred_at sorting
- ✅ Implemented Phase 12 - Extended Report Fields:
  - Added country, city, language filters to War Crimes Exploration
  - Added required crime_occurred_at date picker to report form
  - Added country, city to admin reports table and filters
  - Added translations for all 9 languages

**Latest Completed Work**:
- ✅ Phase 17.3: Created full Country admin UI with full-page forms (new/edit) and RichTextEditor for all 12 war description fields
- ✅ Phase 17.4: Created full Province admin UI with full-page forms (new/edit) and RichTextEditor for all 12 war description fields
- ✅ Phase 17.5: Created full City admin UI with full-page forms (new/edit) and RichTextEditor for all 12 war description fields
- ✅ Updated admin sidebar to include Countries, Provinces, and Cities navigation links
- ✅ Phase 17.6: Updated Admin Reports Management to use relation arrays (`hostileCountryIds`, `attackedCountryIds`, `attackedProvinceIds`, `attackedCityIds`) instead of string inputs for `country` and `city` filters
- ✅ Phase 17.7: Updated War Crimes Exploration page and filters to use new Country, Province, City relation structure
- ✅ Phase 15.2: Created About page (`/[locale]/about`) with mission statement, vision, features grid, how-it-works steps, and CTA
- ✅ Phase 15.3: Created Contact page (`/[locale]/contact`) with hero section, contact form (Name, Email, Subject, Message), contact info cards, and Server Action
- ✅ Phase 15.4: Created FAQ page (`/[locale]/faq`) with accordion layout, search functionality, 4 categories (General, Reporting, Privacy, Technical), 13 questions, and Contact CTA
- ✅ Phase 15.5: Implemented Breadcrumbs navigation component with dynamic path generation, locale-aware links, and translations for all 9 languages
- ✅ Phase 15.5b: Renamed reports/new-multi to reports/new to sync with Header navigation
- ✅ Phase 15.6: Created Privacy Policy, Terms of Service, and Help Center pages with full translations

**Current Phase**: Phase 15 - Public Site Navigation (COMPLETE)
**Next Step**: Phase 16 - Final Polish & Deployment

**Next Session Prompt**:
Phase 15 is now COMPLETE! All major public site navigation features have been implemented:
- About, Contact, FAQ pages with full translations
- Breadcrumbs navigation
- Legal pages (Privacy, Terms, Help)
- Footer with links to all pages

The remaining optional items are:
- 15.10 Newsletter signup

Please review all changes and let me know if you'd like to:
1. Proceed to Phase 16 (Final Polish & Deployment)
2. Implement newsletter signup (15.10)
3. Work on other improvements

Follow the same patterns: one step at a time, update TODO.md, wait for the user to review the changes, and commit with Gitmoji only after approval.

**Frontend Structure**:

```
front/
├── src/
│   ├── app/
│   │   ├── [locale]/              # Public routes with locale
│   │   │   ├── (auth)/            # Auth routes (login, register)
│   │   │   ├── (dashboard)/       # Protected routes (reports)
│   │   │   │   └── reports/
│   │   │   │       ├── new/       # New report page
│   │   │   │       ├── my/       # My reports list
│   │   │   │       └── [id]/     # Report detail
│   │   │   ├── blog/              # Blog listing & posts
│   │   │   ├── documents/        # Public documents
│   │   │   ├── war-crimes/       # War crimes exploration
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── layout.tsx       # Locale layout
│   │   │   └── error.tsx         # Error boundary
│   │   ├── admin/                # Admin panel
│   │   │   ├── dashboard/        # Admin dashboard
│   │   │   ├── reports/          # Reports management
│   │   │   ├── users/            # Users management
│   │   │   ├── tags/             # Tags management
│   │   │   ├── categories/      # Categories management
│   │   │   ├── documents/       # Documents management
│   │   │   ├── blog/            # Blog management
│   │   │   └── layout.tsx        # Admin layout
│   │   ├── actions/             # Server actions
│   │   │   ├── auth/            # Login, register, logout
│   │   │   ├── report/          # Report CRUD
│   │   │   ├── document/         # Document CRUD
│   │   │   ├── category/        # Category CRUD
│   │   │   ├── tag/              # Tag CRUD
│   │   │   ├── blogPost/         # Blog post CRUD
│   │   │   └── user/             # User CRUD
│   │   ├── api/                 # API routes
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── global-error.tsx     # Global error
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components (15+)
│   │   │   ├── button, input, textarea, label
│   │   │   ├── card, dialog, sheet
│   │   │   ├── select, checkbox, tabs
│   │   │   ├── table, toast, badge
│   │   │   ├── avatar, popover
│   │   │   └── form (form field wrapper)
│   │   ├── form/                 # Reusable form components
│   │   │   ├── file-upload-field
│   │   │   ├── tag-selector
│   │   │   ├── emoji-picker
│   │   │   └── location-picker
│   │   ├── layout/              # Layout components
│   │   │   ├── header
│   │   │   ├── footer
│   │   │   ├── admin-sidebar
│   │   │   └── language-switcher
│   │   ├── war-crimes/           # War crimes components
│   │   │   ├── war-crimes-filters
│   │   │   ├── war-crimes-list
│   │   │   ├── war-crimes-map
│   │   │   ├── war-crimes-timeline
│   │   │   ├── war-crimes-statistics
│   │   │   └── war-crimes-export
│   │   ├── map/                  # Map components
│   │   └── providers/            # React providers (theme, etc.)
│   ├── stores/
│   │   └── authStore.ts        # Zustand auth store
│   ├── lib/
│   │   ├── utils.ts            # cn() utility
│   │   └── api.ts              # API client
│   ├── types/
│   │   └── declarations.ts     # Backend type declarations
│   └── i18n/                  # i18n config
│       ├── routing.ts
│       └── request.ts
├── messages/                    # Translation files
│   ├── fa.json               # Persian (RTL, default)
│   ├── en.json               # English
│   ├── ar.json              # Arabic
│   ├── zh.json              # Chinese
│   ├── pt.json              # Portuguese
│   ├── es.json              # Spanish
│   ├── nl.json              # Dutch
│   ├── tr.json              # Turkish
│   └── ru.json              # Russian
├── public/                    # Static assets
│   └── ...                   # images, icons
└── next.config.ts           # Next.js config
```

**Server Actions Pattern**:
Always use this pattern for server actions:

```ts
// src/app/actions/auth/login.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  // ... implementation
  return { success: true, body: { user, token } };
}
```

**Form Pattern** (React Hook Form + Zod + shadcn/ui):

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Call server action
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
```

**Available UI Components** (all in `/src/components/ui/`):

- **Form**: Button, Input, Textarea, Label, Checkbox, Select, Form (FormField, FormItem, FormLabel, FormControl, FormMessage)
- **Layout**: Card, Dialog, Tabs, Table, Dropdown Menu, Popover, Separator
- **Feedback**: Toast (with useToast hook), Badge, Avatar

**Reusable Form Components** (in `/src/components/form/`):

- FormInput - Input/Textarea with label and validation
- FileUploadField - File upload with image preview
- TagSelector - Multi-select tags with chips and search
- EmojiPicker - Emoji-picker-react integration for icons
- LocationPicker - Address input with map placeholder

**Important Reminders**:

- Use types from `/src/types/declarations` for consistency with the backend
- Ghost user level has full admin access
- Keep the report submission page **simple and elegant**
- Admin panel should be powerful but well-organized
- All UI must be beautiful in both RTL (fa, ar) and LTR (en, zh, etc.) modes
- Do not run `pnpm dev` or build commands automatically — only suggest them
- Always test forms with both valid and invalid data
- Use semantic HTML elements
- Follow accessibility best practices
