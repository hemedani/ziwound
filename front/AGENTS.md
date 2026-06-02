# ZiWound Frontend - Next.js Application

## Project Overview

ZiWound frontend is a Next.js 16 application for a war crimes documentation system. It features a war crimes exploration page for searching and exploring documented war crimes, a blog section for articles and updates, a simple and beautiful multi-language report submission page (title, attachments, description, tags, location + minor fields), and a full-featured advanced admin panel for managing reports, documents, blog posts, and users.

### Key Features

- Secure JWT-based authentication with role-based access
- War crimes exploration page with advanced search and filtering
- Blog section with articles, categories, and tags
- Simple and elegant multi-language report submission form
- Document management system linked to reports
- Advanced admin panel with report management, document management, blog management, user management, tags, and file handling
- Full support for nine languages with proper RTL/LTR layout flipping
- Progressive Web App (PWA) capabilities
- Responsive, mobile-first design with dark/light theme support
- Server Actions for all backend communication (secure and efficient)

### Architecture

- **Frontend Framework**: Next.js 16 with App Router (Server Components by default)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI primitives)
- **State Management**: Zustand for global state, React Context for authentication
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl with automatic routing and locale detection
- **Theming**: next-themes for seamless dark/light/system mode
- **API Communication**: Server Actions only (never direct client-side fetch for backend calls)
- **Type Safety**: Generated declarations from backend + strict TypeScript
- **New Features**: War Crimes Exploration Page, Blog Section, Document Management

## Building and Running

### Development Environment

**IMPORTANT: This project uses `pnpm` as the package manager. Never use `npm` or `yarn`.**

```bash
# Install dependencies with pnpm (REQUIRED - do not use npm/yarn)
pnpm install

# Run the development server (uses Turbopack)
pnpm dev
```

The app will be available at `http://localhost:3000` (or the configured port).

### Production Build

The project is configured to use Next.js `standalone` output mode for highly optimized Docker builds.
In production (`Dockerfile`), we extract `.next/standalone` and run it natively via `node server.js` without reinstalling `node_modules`.

#### Build Scripts

This project provides multiple build configurations optimized for different environments:

| Script | Memory | Use Case | Speed |
|--------|--------|----------|-------|
| `pnpm build:server` | 2GB | **VPS/Production** (limited resources) | ⚡ Fastest |
| `pnpm build:local` | 8GB | Local machine (full optimization) | 🐢 Thorough |
| `pnpm build:strict` | 8GB | Pre-deploy (type-check + lint + build) | 🐌 Safest |
| `pnpm build` | 4GB | General purpose | ⚖️ Balanced |

```bash
# On your VPS / Docker (optimized for limited resources)
pnpm build:server

# On your local machine (full optimization)
pnpm build:local

# Before deploying to production (full validation: TypeScript + ESLint + Build)
pnpm build:strict

# General purpose build
pnpm build

# Start production server
pnpm start
```

**`pnpm build:strict`** runs three validation steps in sequence:
1. TypeScript type checking (`tsc --noEmit`)
2. ESLint validation (`eslint .`)
3. Next.js build with 8GB memory limit

This ensures comprehensive error detection before production deployments.

#### TypeScript Configuration Optimizations

The `tsconfig.json` includes performance optimizations:

```json
{
  "compilerOptions": {
    "incremental": true,           // Faster subsequent builds
    "skipLibCheck": true,          // Skip type checking of declaration files
    "noEmit": true,                // Don't emit output (Next.js handles this)
    "moduleResolution": "bundler"  // Modern module resolution
  }
}
```

### Environment Configuration

Key variables:

- `NEXT_PUBLIC_LESAN_URL` – Public backend API URL (client-side)
- `LESAN_URL` – Internal backend URL (server-side)
- `APP_PORT` – Application port (default: 3005 in Docker)

## Development Conventions

### Code Structure

```
front/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/           # Public routes with locale
│   │   ├── admin/              # Admin panel (no locale)
│   │   ├── actions/            # Server actions
│   │   │   ├── auth/           # Auth server actions
│   │   │   └── report/         # Report server actions
│   │   └── globals.css         # Global styles + Tailwind
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── form/               # Reusable form components
│   │   ├── layout/             # Layout components (Header, Footer, Sidebar)
│   │   ├── providers/          # Context providers (Theme, Auth, etc.)
│   │   ├── atoms/              # Atomic design - atoms
│   │   ├── molecules/          # Atomic design - molecules
│   │   └── organisms/          # Atomic design - organisms
│   ├── stores/                 # Zustand stores
│   │   └── authStore.ts        # Auth state
│   ├── lib/                    # Utilities
│   │   ├── utils.ts            # cn() function
│   │   └── api.ts              # API utilities
│   ├── types/                  # TypeScript types
│   │   └── declarations/       # Backend-generated types
│   └── hooks/                  # Custom React hooks
├── messages/                   # next-intl translations
│   ├── fa.json                 # Persian (RTL, default)
│   └── en.json                 # English
├── i18n/                       # Internationalization config
├── public/                     # Static assets
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── TODO.md                     # This file's companion
```

### Available shadcn/UI Components

The project has a comprehensive library of shadcn/ui components located in `/src/components/ui/`:

#### Form Components

- **Button** (`button.tsx`) - Primary action buttons with variants (default, destructive, outline, secondary, ghost, link)
- **Input** (`input.tsx`) - Text input fields
- **Textarea** (`textarea.tsx`) - Multi-line text input
- **Label** (`label.tsx`) - Form labels
- **Checkbox** (`checkbox.tsx`) - Checkbox inputs for multi-select
- **Select** (`select.tsx`) - Dropdown menus for single selection
- **Form** (`form.tsx`) - Complete form components integrating with React Hook Form:
  - `Form` - FormProvider wrapper
  - `FormField` - Individual form field with validation
  - `FormItem` - Container for form elements
  - `FormLabel` - Label with error styling
  - `FormControl` - Wrapper for form controls
  - `FormDescription` - Helper text
  - `FormMessage` - Error messages

#### Layout & Navigation Components

- **Card** (`card.tsx`) - Card containers with header, content, footer
- **Dialog** (`dialog.tsx`) - Modal dialogs:
  - `Dialog`, `DialogTrigger`, `DialogContent`
  - `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- **Tabs** (`tabs.tsx`) - Tabbed interfaces:
  - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Table** (`table.tsx`) - Data tables:
  - `Table`, `TableHeader`, `TableBody`, `TableFooter`
  - `TableRow`, `TableHead`, `TableCell`, `TableCaption`
- **Dropdown Menu** (`dropdown-menu.tsx`) - Context menus and action menus:
  - `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`
  - `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`
  - `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`
- **Separator** (`separator.tsx`) - Visual dividers (horizontal/vertical)
- **Popover** (`popover.tsx`) - Floating overlay containers:
  - `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`
- **Sheet** (`sheet.tsx`) - Slide-out panel component (side drawer):
  - `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose`
- **Accordion** (`accordion.tsx`) - Collapsible content sections:
  - `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- **Toggle** (`toggle.tsx`) - Two-state button (on/off):
  - `Toggle` with variants (default, outline) and sizes (default, sm, lg)
- **Command** (`command.tsx`) - Command palette / combobox primitive:
  - `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`, `CommandDialog`

#### Feedback & Display Components

- **Toast** (`toast.tsx`) - Notification toasts with `useToast` hook:
  - `Toast`, `ToastProvider`, `ToastViewport`
  - `ToastTitle`, `ToastDescription`, `ToastClose`, `ToastAction`
  - Use via: `const { toast } = useToast(); toast({ title: "Success", description: "..." })`
- **Toaster** (`toaster.tsx`) - Toast container (add to root layout)
- **Badge** (`badge.tsx`) - Status indicators and tags (default, secondary, destructive, outline)
- **Avatar** (`avatar.tsx`) - User profile images:
  - `Avatar`, `AvatarImage`, `AvatarFallback`
- **Skeleton** (`skeleton.tsx`) - Loading placeholder with pulse animation
- **Skeleton States** (`skeleton-states.tsx`) - Pre-built skeleton layouts:
  - `SkeletonTable` - Skeleton for table loading states
  - `SkeletonList` - Skeleton for list/card loading states
- **EmptyState** (`empty-state.tsx`) - Empty/no data state component
- **ErrorState** (`error-state.tsx`) - Error state with retry action

### Reusable Form Components

Located in `/src/components/form/`, these components provide higher-level form functionality:

- **FormInput** (`form-field.tsx`) - Input/Textarea with label and validation

  ```tsx
  <FormInput name="email" label="Email" type="email" placeholder="Enter email" />
  <FormInput name="description" label="Description" multiline rows={4} />
  ```

- **FileUploadField** (`file-upload-field.tsx`) - File upload with image preview

  ```tsx
  <FileUploadField
    label="Attachments"
    maxFiles={10}
    maxSize={10 * 1024 * 1024}
    accept="image/*,.pdf"
    value={files}
    onChange={(files) => setFiles(files)}
  />
  ```

- **RichTextEditor** (`rich-text-editor.tsx`) - TipTap-based rich text editor with toolbar

  ```tsx
  import { RichTextEditor } from "@/components/form/rich-text-editor";

  <RichTextEditor
    value={content}
    onChange={(html) => setContent(html)}
    placeholder="Enter content..."
  />
  ```

  **Features:**
  - **Formatting**: Bold, Italic, Strikethrough
  - **Headings**: H1, H2, H3
  - **Lists**: Bullet list, Ordered list
  - **Blocks**: Blockquote, Code
  - **Media**: Links, Images (via URL)
  - **Tables**: Insert resizable tables with header rows
  - **HTML Import**: Dialog to paste raw HTML and parse it into the editor
  - **Undo/Redo**: Full history support
  - **Extensions**: Uses `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-table`

- **AsyncSelect** (`async-select.tsx`) - Powerful combobox with async/sync loading, search, and multi-select

  ```tsx
  import { AsyncSelect } from "@/components/form/async-select";

  // Static options
  <AsyncSelect
    value={selectedId}
    onChange={(val) => setSelectedId(val)}
    options={[
      { id: "1", label: "Option 1", subLabel: "Description" },
      { id: "2", label: "Option 2" },
    ]}
    placeholder="Select an option..."
  />

  // Async loading with search
  <AsyncSelect
    value={selectedId}
    onChange={(val) => setSelectedId(val)}
    async={true}
    loadOptions={async (inputValue, page) => {
      const res = await fetchOptions({ search: inputValue, page });
      return {
        options: res.body.map(item => ({ id: item._id, label: item.name })),
        hasMore: res.hasMore
      };
    }}
    placeholder="Search..."
  />
  ```

  **Props:**
  - `value`: Current selected value (`string | string[] | null`)
  - `onChange`: Callback on selection change
  - `isMulti`: Enable multi-select (default: false)
  - `isClearable`: Enable clearing selection (default: true)
  - `async`: Enable async loading mode
  - `loadOptions`: `(inputValue: string, page?: number) => Promise<{ options, hasMore? }>`
  - `options`: Static options array of `{ id, label, subLabel?, prefix?, data? }`
  - `renderOption`: Custom option renderer
  - `disabled`, `loading`, `placeholder`, `searchPlaceholder`, `emptyText`

- **TagSelector** (`tag-selector.tsx`) - Multi-select tags with chips and search

  ```tsx
  <TagSelector
    label="Tags"
    availableTags={tags}
    selectedTags={selectedTags}
    onChange={(tags) => setSelectedTags(tags)}
    creatable={true}
  />
  ```

- **LocationPicker** (`location-picker.tsx`) - Address input with map placeholder

  ```tsx
  <LocationPicker
    label="Location"
    value={location}
    onChange={(loc) => setLocation(loc)}
    showMap={true}
  />
  ```

- **DatePickerField** (`date-picker-field.tsx`) - Calendar date picker with locale-aware calendar (Gregorian/Persian)

  ```tsx
  import { DatePickerField } from "@/components/form/date-picker-field";

  <DatePickerField
    value={dateValue}
    onChange={(date) => setDateValue(date)}
    locale="fa"  // "fa" for Persian calendar, "en" for Gregorian
    placeholder="Select date..."
  />
  ```

  **Features:**
  - Automatic calendar switching based on locale (Persian Jalali for `fa`, Gregorian for others)
  - Stores dates as ISO strings (`YYYY-MM-DD`) internally
  - Display format adapts to locale (`YYYY/MM/DD` for Persian, `YYYY-MM-DD` for Gregorian)
  - Uses `react-multi-date-picker` and `react-date-object`
  - Popover-based UI with glass styling

- **GradientInput** (`gradient-input.tsx`) - CSS gradient selector with live preview and presets

  ```tsx
  import { GradientInput } from "@/components/form/gradient-input";

  <GradientInput
    value={gradient}
    onChange={(val) => setGradient(val)}
    placeholder="Enter CSS gradient..."
  />
  ```

  **Features:**
  - Live preview of the gradient
  - 8 preset gradients (Crimson Glow, Midnight, Blood Moon, Ember, Obsidian, Steel, Gold Dust, Abyss)
  - Custom CSS input for manual gradients
  - Used for hero slide backgrounds

- **ImagePicker** (`image-picker.tsx`) - Image gallery selector from uploaded files

  ```tsx
  import { ImagePicker } from "@/components/form/image-picker";

  <ImagePicker
    value={selectedImageId}
    onChange={(id) => setSelectedImageId(id)}
  />
  ```

  **Features:**
  - Fetches images from backend via `gets` file action
  - Search by filename
  - Paginated grid view (3 columns)
  - Selection highlight with crimson border
  - Uses `next/image` with proxy URLs

- **DocumentListField** (`document-list-field.tsx`) - Document management field for report forms

  ```tsx
  import { DocumentFormField } from "@/components/form/document-list-field";

  <DocumentFormField
    value={documentIds}
    onChange={(ids) => setDocumentIds(ids)}
    locale={locale}
  />
  ```

  **Features:**
  - Displays list of attached documents with remove capability
  - Dialog to create new documents (title, description, language, file upload)
  - Creates Document records via server action and returns IDs
  - Integrates with `FileUploadField` for file attachment

- **Stepper** (`stepper.tsx`) - Multi-step form navigation indicator

  ```tsx
  import { Stepper } from "@/components/form/stepper";

  <Stepper
    currentStep={2}
    totalSteps={5}
    completedSteps={[1]}
    onStepClick={(step) => goToStep(step)}
    labels={["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]}
  />
  ```

- **StepRenderer** (`step-renderer.tsx`) - Renders form fields based on current step in multi-step forms

  ```tsx
  import { StepRenderer } from "@/components/form/step-renderer";

  <StepRenderer
    step={currentStep}
    control={form.control}
    errors={form.formState.errors}
    setValue={form.setValue}
    watch={form.watch}
    categories={categories}
    availableTags={tags}
    locale={locale}
  />
  ```

  **Step mapping:**
  - Step 1: title, description, selected_language
  - Step 2: crime_occurred_at, priority, tags, category
  - Step 3: location, address, hostileCountryIds, attackedCountryIds, attackedProvinceIds, attackedCityIds
  - Step 4: documents

- **EmojiPicker** (`tag-form.tsx`) - Integrated `emoji-picker-react` via `next/dynamic` for icons

### Layout Components

Located in `/src/components/layout/`:

- **Header** (`header.tsx`) - Main site header with logo, navigation, language switcher, theme toggle, and user menu
- **Footer** (`footer.tsx`) - Site footer with quick links and support information
- **AdminSidebar** (`admin-sidebar.tsx`) - Collapsible sidebar for admin panel
- **LanguageSwitcher** (`language-switcher.tsx`) - Dropdown for switching between 9 supported languages

### Theme Configuration

The app uses **next-themes** for seamless dark/light/system mode:

- ThemeProvider is wrapped in root layout (`src/app/layout.tsx`)
- Dark mode CSS variables defined in `globals.css` under `.dark` class
- Theme toggle available via `useTheme()` hook from next-themes
- System preference detection enabled by default
- Smooth transitions between themes (0.3s ease)

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark"); // or 'light' or 'system'
```

### Internationalization

- The application supports **nine languages**:
  - Persian (fa) – default locale
  - English (en)
  - Arabic (ar)
  - Chinese (zh)
  - Portuguese (pt)
  - Spanish (es)
  - Dutch (nl)
  - Turkish (tr)
  - Russian (ru)
- Uses **next-intl** (latest version compatible with Next.js 16 App Router) for complete internationalization, including automatic locale detection, routing, message formatting, and pluralization.
- Translation files are located in the `/messages` directory:
  - `fa.json` (default + most complete)
  - `en.json`
  - `ar.json`
  - `zh.json`
  - `pt.json`
  - `es.json`
  - `nl.json`
  - `tr.json`
  - `ru.json`
- Automatic text direction (dir) handling:
  - **RTL**: Persian (fa) and Arabic (ar)
  - **LTR**: English (en), Chinese (zh), Portuguese (pt), Spanish (es), Dutch (nl), Turkish (tr), Russian (ru)
- Locale routing is configured in `i18n/routing.ts` with a full list of supported locales and proper fallback strategy.
- Middleware (`middleware.ts`) handles intelligent locale detection from URL path, cookie (user preference), and browser `Accept-Language` header.
- Supports locale-prefixed URLs (e.g. `/fa/reports`, `/tr/reports`, `/ru/reports`, etc.).
- **Admin routes** (`/admin/*`) are completely excluded from locale-based routing and accessible without any prefix.
- User’s preferred locale is persistently stored in cookies.
- Uses next-intl navigation utilities (`Link`, `redirect`, `usePathname`, `useRouter`, etc.) for locale-aware navigation.
- Fully integrated with Next.js App Router through `middleware.ts` and `i18n/request.ts`.
- All UI text, form labels, validation messages, notifications, and admin panel must be translated in all nine languages.
- RTL/LTR layout flipping is handled automatically using logical properties.
- Date, number, and time formatting respect the current locale.

#### RTL Gotchas with Radix UI Components

Some `@radix-ui` primitives (e.g. `Tabs`, `NavigationMenu`, `Slider`) inject `dir="ltr"` by default when no explicit `dir` prop is provided, even if the page's `<html>` element already has `dir="rtl"`. Because CSS `direction` is inherited, any child component rendered inside such a primitive will unexpectedly compute as LTR, which breaks:

- **Logical properties** (`start-*` / `end-*` utilities from Tailwind)  
  In RTL these resolve to the physical left/right edges, so `start-3` will pin an element to the left instead of the right.
- **Flex layouts** (`justify-between`, `text-start`, etc.) reverse incorrectly.
- **Text alignment** defaults to left-aligned instead of right-aligned for Arabic/Persian content.

**Always explicitly forward the locale's `dir` to Radix UI components:**

```tsx
const isRTL = locale === "fa" || locale === "ar";

// ❌ BAD – Tabs defaults to dir="ltr", breaking all children
<Tabs defaultValue="list" className="w-full">

// ✅ GOOD – Explicitly pass the direction
<Tabs defaultValue="list" className="w-full" dir={isRTL ? "rtl" : "ltr"}>
```

> **Note:** This fix was applied to the `war-crimes` page (`src/app/[locale]/war-crimes/page.tsx`) where the `<ReportCard>` components inside `<TabsContent>` were rendering LTR in Persian. After adding `dir={isRTL ? "rtl" : "ltr"}` to the `<Tabs>` root, the cards correctly inherited RTL and badges/footers aligned properly.

### Styling

- **Tailwind CSS v4** as the core utility framework (`@import "tailwindcss";` in globals.css).
- **shadcn/ui** as the primary component library (built on Radix UI + Tailwind).
  - Full RTL support (CLI generates logical properties when `rtl: true` in `components.json`).
  - Excellent accessibility and customization.
- Dark theme using Tailwind v4 `@custom-variant dark` + **next-themes** (no FOUC).
- Mobile-first responsive design.
- Logical properties (`ps-`, `me-`, `start-`, `end-`, etc.) preferred for RTL compatibility.
- Consistent design tokens via CSS variables and `@theme` directive.
- All components must be beautiful and professional in both LTR and RTL modes.

#### Setup & Best Practices

1. Configure `components.json` with `"rtl": true`.
2. Global stylesheet includes Tailwind import and dark variant.
3. Wrap app with `ThemeProvider` from next-themes.
4. Use shadcn CLI to add components and verify RTL behavior.
5. Maintain consistent typography, colors, and spacing.

### Authentication

- JWT-based with secure cookie handling.
- Auth state managed via React Context + Zustand where needed.

### User Model

The user model defines the schema for all user accounts in the system.

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `first_name` | `string` | Yes | User's first name |
| `last_name` | `string` | Yes | User's last name |
| `gender` | `"Male" \| "Female"` | Yes | User's gender |
| `birth_date` | `Date` (stored) / `ISO string` (sent) | No | Date of birth |
| `summary` | `string` | No | Short bio/summary |
| `address` | `string` | No | Physical address |
| `level` | `enum` | Yes (default: `"Ordinary"`) | Role/permission level |
| `email` | `string` (unique) | Yes | Email address |
| `password` | `string` | Yes | Hashed on backend |
| `is_verified` | `boolean` (default: `false`) | Auto | **Email verification** – indicates whether the user's email address has been verified |
| `bio` | `localizedWarInfo` | No | Localized biography object with keys: `fa`, `en`, `ar`, `zh`, `pt`, `es`, `nl`, `tr`, `ru` |
| `expertise` | `string[]` | No | Array of expertise strings |
| `verified` | `boolean` (default: `false`) | Auto | **Role-level verification** – indicates whether the user has been verified for their role level (e.g., Diplomat, Researcher). Distinct from `is_verified` |
| `verificationBadge` | `string` | No | Badge identifier for verified users |
| `isPublic` | `boolean` (default: `true`) | Auto | Profile visibility flag |
| `createdAt` | `Date` | Auto | Creation timestamp |
| `updatedAt` | `Date` | Auto | Last update timestamp |

#### Relations

| Relation | Type | Description |
|----------|------|-------------|
| `avatar` | single `File` | User's profile image |
| `national_card` | single `File` | National card document |
| `province` | single `Province` | User's province |
| `city` | single `City` | User's city |

#### User Levels

```
"Ghost" | "Manager" | "Editor" | "Reporter" | "Artist" | "Diplomat" | "Researcher" | "Ordinary"
```

- **Ghost** – Highest privileges, full admin access. **CRITICAL SECURITY**: Ghost users must NEVER be displayed on public-facing pages (e.g., `/reporters`, `/reporters/[id]`). There is only one Ghost user in the system. This user can perform fundamental and dangerous operations. Always filter out `level === "Ghost"` from any public user listings or profile pages.
- **Ghost in edit forms**: The Ghost level is hidden from the admin edit user form and Zod schema — it is only assignable via the backend `tempUser` setup.
- **level_XXX translation keys**: When translating user level names, use `t("level_Ghost")`, `t("level_Manager")`, `t("level_Editor")`, `t("level_Ordinary")`, etc. For Reporter, Artist, Diplomat, Researcher, use `t("Reporter")`, `t("Artist")`, `t("Diplomat")`, `t("Researcher")`.
- **Manager** – Administrative management
- **Editor** – Content editing capabilities
- **Reporter** – Can submit and manage reports
- **Artist** – Media/content creation
- **Diplomat** – Verified diplomatic role
- **Researcher** – Verified research role
- **Ordinary** – Default level for new registrations

#### Important Distinction: `is_verified` vs `verified`

- **`is_verified`** – Email verification flag. Set to `true` when the user's email address has been confirmed.
- **`verified`** – Role-level verification flag. Set to `true` when the user has been manually verified for their assigned role level (e.g., a Diplomat or Researcher has been vetted and approved).

These are two separate concepts and should not be confused. Forms should display helper text to clarify the distinction.

#### Server Actions

User-related server actions are located in `src/app/actions/user/`:

- `addUser.ts` – Create a new user (requires `email`, `password`, `first_name`, `last_name`, `gender`, `level`)
- `updateUser.ts` – Update an existing user (partial updates, all fields optional)
- `updateUserRelations.ts` – Update user relations (`avatar`, `national_card`, `province`, `city`)
- `registerUser.ts` – Public registration (auto-sets `level: "Ordinary"`, `is_verified: false`, `verified: false`, `isPublic: true`)
- `getUsers.ts` – Fetch multiple users with pagination/filtering
- `getUser.ts` – Fetch a single user by ID
- `getMe.ts` – Fetch the authenticated user's own data
- `removeUser.ts` – Delete a user
- `countUsers.ts` – Get user count
- `login.ts` / `logout.ts` – Authentication
- `tempUser.ts` – Temporary user handling
- `dashboardStatistic.ts` – User statistics for dashboard

#### Removed Fields (Deprecated)

The following fields were removed from the user model and should NOT be used:

- `father_name` – Was optional, now removed
- `mobile` – Was pattern-validated, now commented out
- `national_number` – Was national number validation, now commented out

## Key Configuration Files

- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.ts` (minimal – prefer CSS `@theme`)
- `components.json` (shadcn/ui config)
- `middleware.ts`
- `i18n/routing.ts`
- `Dockerfile`

## Project Guidelines

You are a front-end expert in Next.js 16, Tailwind v4, and shadcn/ui. Always prioritize **clean, beautiful, intuitive, and accessible** UIs. The report submission page must feel simple and welcoming; the admin panel must be powerful yet well-organized.

- **STRICT RULE FOR AI AGENTS**: Use **pnpm** for all `npm` like commands.
- Use **Server Actions** in `src/app/actions/<model>/` for all backend communication (preferred pattern: `add`, `get`, `gets`, `update`, `remove`, etc.).
- Backend responses follow: `{ success: boolean, body: data }`. Always access data via `response.body`.
- For authentication: token is sent in header `token` (no "Bearer" prefix), stored in cookie named "token".
- Strictly follow clean code, clean architecture, and best practices. Remove unused code, console.logs, etc.
- Use shadcn/ui components (Button, Input, Textarea, Card, Table, Form, Dialog, etc.) as the foundation.
- All new forms: React Hook Form + Zod.
- **STRICT RULE FOR AI AGENTS**: When adding translations, add keys to **all** language files in the `/messages` directory. Furthermore, when using `getTranslations()` in Server Components, ALWAYS pass the `locale` parameter explicitly (e.g., `await getTranslations({ locale })`) to prevent fallback to the default language.
- Test thoroughly in fa (RTL) and en (LTR).

### API Calls Best Practice

Always use server actions instead of client-side fetch. Example:

```ts
import { createReport } from "@/app/actions/report/create";

const result = await createReport(formData);
if (result.success) {
  // data is in result.body
}
```

### PWA and Offline Support

- The app uses `@ducanh2912/next-pwa` for PWA capabilities.
- Configured in `next.config.ts` with a fallback offline page at `src/app/~offline/page.tsx`.
- Manifest and icons are stored in the `public` directory.

### UX and Loading States

- Always use `shadcn/ui` `Skeleton` component for data lists while loading.
- Use `loading.tsx` in Next.js App Router to automatically wrap Server Components with skeleton loaders.
- Use the `Loader2` icon from `lucide-react` with the `animate-spin` class inside buttons to indicate form submission or async actions in progress.

### Error Handling

- All Server Actions **must** be wrapped in a `try...catch(error: unknown)` block and safely return `{ success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } }` on failure. This ensures the Next.js process doesn't crash and the React Hook Form UI can display the error gracefully.
- The app uses Next.js Error Boundaries (`error.tsx` and `global-error.tsx`).
- Always provide user-friendly error messages and a "Try again" (reset) button (use the shared `ErrorState` component).
- Client-side error states (e.g., in `MyReportsPage`) should display an inline error UI instead of completely crashing the page.

### Standardized UI States

To maintain consistent UX and reduce hardcoded layouts, use the standardized edge-case components from `@/components/ui/`:

- **Loading:** Use `SkeletonTable` and `SkeletonList` for declarative, robust loading states.
- **Empty/No Data:** Use `EmptyState` for empty tables, cleared filters, or missing data views.
- **Error:** Use `ErrorState` for inline API failures requiring a user retry.

### Performance & Security

- **Images:** Always use `next/image` (`<Image />`) instead of standard `<img>` tags for automatic optimization.
- **Image Proxy API:** Use `/api/image-proxy?path=` to proxy images from the backend, avoiding private IP blocking issues.
- **Static Content:** Use proxy routes to serve files from backend (images, videos, documents).
- **Required Props:** When using `<Image fill />`, always include the `sizes` prop for proper responsive images.
- **unoptimized:** For proxied images, add `unoptimized` to disable Next.js optimization (avoids private IP detection):
  ```tsx
  <Image src={url} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" />
  ```
- **Next.js Image Config:** Configure allowed remote domains in `next.config.ts`:
  ```ts
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  ```
- **Code Splitting:** Lazy load heavy client components (like `emoji-picker-react` or mapping libraries) using `next/dynamic` to shrink the initial JS bundle.
- **Security Headers:** The `next.config.ts` injects standard security headers (`X-DNS-Prefetch-Control`, `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, etc.).
- **Cookies:** Authentication JWT tokens are stored in `httpOnly` secure cookies via Next.js Server Actions.

### Static Content Proxy Routes

This project uses proxy routes to serve static content (images, files) from the backend. This avoids CORS issues and private IP blocking.

#### Image Proxy Route (`/api/image-proxy`)

Proxies images from the backend through the Next.js server.

**Route:** `/api/image-proxy?path=<encoded-path>`

**Example:**

```
/api/image-proxy?path=uploads/images/filename.jpg
```

**Implementation (`src/app/api/image-proxy/route.ts`):**

```ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  // Use 127.0.0.1 instead of localhost to avoid private IP blocking
  const backendPort = process.env.LESAN_URL?.split(":").pop()?.split("/")[0] || "1406";
  const fullUrl = `http://127.0.0.1:${backendPort}/${path.startsWith("/") ? path.substring(1) : path}`;

  const response = await fetch(fullUrl, {
    method: "GET",
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  const imageBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
```

#### API Proxy Route (`/api/proxy`)

Proxies JSON API requests to the backend, handling authentication and multipart uploads.

**Route:** `/api/proxy` (POST)

**Features:**

- Forwards `Authorization` and `Cookie` headers
- Handles multipart/form-data for file uploads
- 55-second timeout for large uploads
- Returns JSON response

#### Image URL Utility (`src/utils/imageUrl.ts`)

Use the helper functions to generate proper URLs:

```ts
import { getImageUrl, getImageUploadUrl } from "@/utils/imageUrl";

// Generic image URL
getImageUrl("uploads/images/filename.jpg");
// => "/api/image-proxy?path=uploads/images/filename.jpg"

// Specific for uploaded files (auto-appends folder)
getImageUploadUrl("filename.jpg", "image");
// => "/api/image-proxy?path=uploads/images/filename.jpg"

getImageUploadUrl("file.pdf", "docs");
// => "/api/image-proxy?path=uploads/docs/file.pdf"
```

**Note:** Use `NEXT_PUBLIC_APP_URL` env var to override the base URL (defaults to `http://localhost:3000`).

#### Using Images in Components

```tsx
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";

<Image
  src={getImageUploadUrl(coverImage?.name)}
  alt={title}
  fill
  unoptimized
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>;
```

**CRITICAL: Always use `file.name` (NOT `file._id`) when constructing image URLs.**

The backend stores uploaded files with a `name` field that represents the actual filename on disk. The proxy URL is constructed as `uploads/{type}/{name}`. Using `_id` will result in broken images.

```tsx
// ✅ CORRECT - Use file.name
<Image src={getImageUploadUrl(file.name, "image")} alt={file.name} fill unoptimized />

// ❌ WRONG - Never use file._id for URLs
<Image src={getImageUploadUrl(file._id, "image")} alt={file.name} fill unoptimized />
```

This applies to all file-related models: `fileSchema`, `heroSlide.image`, `warCriminal.photo`, `user.avatar`, `blogPost.coverImage`, `document.documentFiles`, etc. Always access the `.name` property of the nested file object.

#### Download Links

For download links (not rendered as images), use the URL directly:

```tsx
<a href={getImageUploadUrl(file.name, file.type)} download>
  <DownloadIcon />
</a>
```

### Environment Variables for Static Content

- `LESAN_URL` - Internal backend URL (e.g., `http://localhost:1406`)
- `NEXT_PUBLIC_APP_URL` - Public app URL (for image proxy base, defaults to `http://localhost:3000`)

### Accessibility (a11y)

- Interactive elements (Buttons, Inputs, etc.) must have proper focus rings: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- Use `aria-label` on icon-only buttons (e.g., Theme Switcher, Language Switcher, Hamburger Menu).

### RichTextEditor Content Sync

The `RichTextEditor` component (`src/components/form/rich-text-editor.tsx`) uses TipTap's `useEditor` which only reads the `content` prop on mount. If the `value` prop changes after the initial render (e.g., when editing a form with pre-populated data), the editor content won't update. A `useEffect` is required to sync:

```tsx
useEffect(() => {
  if (editor && value) {
    editor.commands.setContent(value, { emitUpdate: false });
  }
}, [editor, value]);
```

### Form Validation Localization

- Use `zod` for schema validation.
- To localize Zod error messages with variables, pass a stringified JSON object as the custom error message.
  Example: `z.string().min(6, JSON.stringify({ key: "validation.minLength", values: { min: 6 } }))`
- The `FormMessage` component inside `src/components/ui/form.tsx` is equipped to parse this JSON and translate it using `next-intl`.

---

## Server Actions Architecture (Lesan Framework Integration)

This section documents the standardized server actions pattern for integrating Next.js with the Lesan backend framework. This pattern can be reused across any project using Lesan.

### Overview

Server Actions are the exclusive method for backend communication. They provide:

- **Security**: All requests run server-side, hiding backend URLs and sensitive logic
- **Type Safety**: Full TypeScript support via auto-generated `ReqType` declarations from Lesan
- **Consistency**: Uniform CRUD pattern across all models
- **Authentication**: Automatic JWT token extraction from secure cookies
- **Selective Data Fetching**: Specify exactly which fields to return (GraphQL-like)

### Directory Structure

Organize server actions by model in a predictable hierarchy:

```
src/app/actions/
├── <model>/              # e.g., category, report, user, tag, city, province
│   ├── add.ts           # Create a single record
│   ├── get.ts           # Retrieve a single record by ID
│   ├── gets.ts          # Retrieve multiple records (with pagination/filtering)
│   ├── update.ts        # Update an existing record
│   ├── remove.ts        # Delete a record
│   └── count.ts         # Get count of records (optional, for pagination)
├── auth/                # Authentication-specific actions
│   ├── login.ts
│   ├── logout.ts
│   └── register.ts
└── file/                # File-specific operations
    ├── getFiles.ts
    └── upload.ts
```

### Standard Action Pattern

Every standard action follows this template:

```ts
"use server";
import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const <actionName> = async (
  data: ReqType["main"]["<model>"]["<action>"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["<model>"]["<action>"]["get"]>
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const result = await AppApi(undefined, token).send({
    service: "main",
    model: "<model>",
    act: "<action>",
    details: {
      set: data,
      get: getSelection || {},
    },
  });

  return result;
};
```

#### Key Components

1. **`"use server"` directive**: Marks the file as a Server Actions module
2. **`AppApi`**: Centralized API client that handles Lesan protocol and authentication
3. **`ReqType`**: Auto-generated type definitions from Lesan backend (ensures type safety)
4. **`DeepPartial`**: Utility type for optional field selection (allows partial objects)
5. **`cookies()`**: Next.js API for reading secure HTTP-only cookies server-side

### Action Types Explained

#### 1. **add** - Create a Record

Creates a new record in the database.

```ts
// src/app/actions/category/add.ts
import { add } from "@/app/actions/category/add";

// Usage
const newCategory = await add(
  {
    name: "Technology",
    color: "#3B82F6",
    icon: "laptop",
  },
  {
    _id: 1,
    name: 1,
    color: 1,
  },
);
```

**Parameters:**

- `set`: Required fields for creation (varies by model schema)
- `get`: Optional field selection for response (returns specified fields only)

#### 2. **get** - Retrieve a Single Record

Fetches one record by its unique identifier.

```ts
// src/app/actions/category/get.ts
import { get } from "@/app/actions/category/get";

// Usage
const category = await get(
  { _id: "507f1f77bcf86cd799439011" },
  {
    _id: 1,
    name: 1,
    color: 1,
    icon: 1,
    createdAt: 1,
  },
);
```

**Parameters:**

- `set`: Must include `_id` of the record to fetch
- `get`: Fields to return in the response

#### 3. **gets** - Retrieve Multiple Records

Fetches multiple records with optional filtering, pagination, and sorting.

```ts
// src/app/actions/category/gets.ts
import { gets } from "@/app/actions/category/gets";

// Usage - Basic fetch
const categories = await gets(
  { page: 1, limit: 20 },
  {
    _id: 1,
    name: 1,
    color: 1,
  },
);

// Usage - With filtering
const filteredCategories = await gets(
  {
    page: 1,
    limit: 10,
    filter: { color: "#3B82F6" },
  },
  { _id: 1, name: 1, color: 1 },
);
```

**Parameters:**

- `set`: Pagination object (`page`, `limit`) and optional `filter` criteria
- `get`: Fields to return for each record

#### 4. **update** - Modify a Record

Updates an existing record by its ID.

```ts
// src/app/actions/category/update.ts
import { update } from "@/app/actions/category/update";

// Usage
const updatedCategory = await update(
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Updated Name",
    color: "#EF4444",
  },
  { _id: 1, name: 1, color: 1 },
);
```

**Parameters:**

- `set`: Must include `_id` plus fields to update (partial updates allowed)
- `get`: Fields to return after update

#### 5. **remove** - Delete a Record

Permanently deletes a record from the database.

```ts
// src/app/actions/category/remove.ts
import { remove } from "@/app/actions/category/remove";

// Usage
const result = await remove(
  { _id: "507f1f77bcf86cd799439011" },
  { _id: 1 }, // Returns deleted record's ID
);
```

**Parameters:**

- `set`: Must include `_id` of the record to delete
- `get`: Optional fields to return (usually just `_id` for confirmation)

#### 6. **count** - Get Record Count

Returns the total number of records matching criteria (useful for pagination).

```ts
// src/app/actions/category/count.ts
import { count } from "@/app/actions/category/count";

// Usage
const totalCategories = await count({ filter: { isActive: true } }, { count: 1 });
```

**Parameters:**

- `set`: Optional `filter` criteria to count specific subset
- `get`: Usually just `{ count: 1 }`

### Field Selection (`get` Parameter)

The `get` parameter works like GraphQL field selection - you specify exactly which fields to return:

```ts
// Return only specific fields
{
  _id: 1,
  name: 1,
  email: 1
}

// Include nested relations
{
  _id: 1,
  name: 1,
  registrar: {
    _id: 1,
    first_name: 1,
    last_name: 1
  },
  province: {
    _id: 1,
    name: 1
  }
}

// Return all fields (not recommended for performance)
{}
```

**Best Practices:**

- Always specify fields explicitly (never use `{}` unless necessary)
- Only request fields you actually need (reduces payload size)
- Use nested selections for related data (avoids N+1 queries)

### Field Naming Conventions & Relationships

When working with the Leasan backend, understand these important patterns:

#### 1. Field Projections in `get` Parameter
Use nested objects to fetch related data, NOT camelCase IDs:

```ts
// ✅ CORRECT - Use nested relation objects
const provinces = await getProvinces(
  { page: 1, limit: 20 },
  {
    _id: 1,
    name: 1,
    country: {  // NOT 'countryId'
      _id: 1,
      name: 1,
    },
  }
);

// ✅ CORRECT - For cities with province and country
const cities = await getCities(
  { page: 1, limit: 20 },
  {
    _id: 1,
    name: 1,
    province: {  // NOT 'provinceId'
      _id: 1,
      name: 1,
    },
    country: {   // NOT 'countryId'
      _id: 1,
      name: 1,
    },
  }
);
```

#### 2. Set Parameters in `add` and `update` Actions
Use camelCase IDs when creating or updating records:

```ts
// ✅ CORRECT - Use camelCase IDs in 'set' parameter
const newProvince = await add(
  {
    name: "Tehran",
    english_name: "Tehran",
    countryId: "123...",  // camelCase ID
    wars_history: "...",
  },
  { _id: 1, name: 1 }
);

// ✅ CORRECT - For cities
const newCity = await add(
  {
    name: "City Name",
    english_name: "City Name",
    countryId: "123...",   // camelCase ID
    provinceId: "456...",  // camelCase ID
    isCapital: false,
    wars_history: "...",
  },
  { _id: 1, name: 1 }
);
```

#### 3. Update Relations Separately
Relations (like changing a province's country) must be updated via `updateRelations`:

```ts
// ✅ CORRECT - Update basic fields
await update(
  {
    _id: provinceId,
    name: "New Name",
    wars_history: "...",
    // Note: cannot change countryId here
  },
  { _id: 1 }
);

// ✅ CORRECT - Update relations separately
await updateRelations(
  {
    _id: provinceId,
    country: newCountryId,  // Use 'country', not 'countryId'
  },
  { _id: 1 }
);
```

#### 4. TypeScript Type Handling
When relations are returned as nested objects, extend the schema type:

```ts
// ✅ CORRECT - Extend schema type for nested relations
interface CityWithRelations extends citySchema {
  province?: { _id?: string; name?: string };
  country?: { _id?: string; name?: string };
}

// Use in components
const city: CityWithRelations = await getCity(...);
console.log(city.province?._id);  // Access nested ID
```

### Location Models (Country, Province, City)

The location models (`country`, `province`, `city`) share a common pattern for photo management and relation updates.

#### Photo Relation

All three location models have a `photo` relation (single `File`). The photo is managed differently depending on the operation:

**Creating a record (`add`):**
Pass `photoId` directly in the `set` parameter:

```ts
// ✅ CORRECT - Include photoId in add
await add(
  {
    name: "Country Name",
    english_name: "Country Name (EN)",
    ...(photoId ? { photoId } : {}),  // Only include if set
    // ... other fields
  },
  { _id: 1, name: 1 }
);
```

**Updating a record (`update` + `updateRelations`):**
Photo updates must go through `updateRelations`, NOT `update`. Basic fields go to `update`, relations go to `updateRelations`:

```ts
// ✅ CORRECT - Update basic fields via update
await update(
  {
    _id: countryId,
    name: "Updated Name",
    english_name: "Updated English Name",
    // ... other non-relation fields
  },
  { _id: 1, name: 1 }
);

// ✅ CORRECT - Update photo via updateRelations
await updateRelations(
  {
    _id: countryId,
    photo: photoId || undefined,  // Use relation name 'photo', not 'photoId'
  },
  { _id: 1, photo: { _id: 1, name: 1 } }
);
```

**Fetching records (`gets`):**
Include `photo` in the field selection to get photo data for display:

```ts
// ✅ CORRECT - Request photo in gets
const response = await gets(
  { page: 1, limit: 20 },
  {
    _id: 1,
    name: 1,
    english_name: 1,
    photo: { _id: 1, name: 1 },  // Required to display photo in tables
  }
);
```

#### Country UpdateRelations

The `country.updateRelations` server action is located at `src/app/actions/country/updateRelations.ts`. Use it to update the `photo` relation for countries:

```ts
import { updateRelations } from "@/app/actions/country/updateRelations";

await updateRelations(
  { _id: countryId, photo: photoId || undefined },
  { _id: 1, photo: { _id: 1, name: 1 } }
);
```

Province and city models use their respective `updateRelations` actions for updating `country`, `province`, and `photo` relations.

#### Image Picker with Upload Pattern

For admin forms that need image selection, use a tabbed interface with `ImagePicker` (library) and `FileUploadField` (upload):

```tsx
import { useState } from "react";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Manage photoId as external state (NOT inside React Hook Form)
const [photoId, setPhotoId] = useState<string>(initialData?.photo?._id || "");

<Tabs defaultValue="library">
  <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
    <TabsTrigger value="library">{t("imageLibrary") || "Library"}</TabsTrigger>
    <TabsTrigger value="upload">{t("uploadNew") || "Upload"}</TabsTrigger>
  </TabsList>
  <TabsContent value="library" className="mt-3">
    <ImagePicker
      value={photoId}
      onChange={(id) => setPhotoId(id || "")}
    />
  </TabsContent>
  <TabsContent value="upload" className="mt-3">
    <FileUploadField
      label=""
      maxFiles={1}
      accept="image/*"
      value={photoId ? [photoId] : []}
      onChange={(ids) => setPhotoId(ids[0] || "")}
    />
  </TabsContent>
</Tabs>
```

**Critical:** Manage `photoId` as external `useState`, NOT as a React Hook Form field. `TabsContent` conditionally renders children, which causes RHF to lose track of fields when switching tabs. Merge the photo ID with form values on submit:

```tsx
const handleSubmit = (values: FormValues) => {
  onSubmit({ ...values, photoId: photoId || undefined });
};
```

#### Displaying Photos in Tables

When displaying photos in admin tables, use `next/image` with the proxy URL helper:

```tsx
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";

{record.photo ? (
  <Image
    src={getImageUploadUrl(record.photo.name, "image")}
    alt={record.name}
    width={48}
    height={48}
    unoptimized
    className="rounded object-cover"
  />
) : (
  <div className="h-12 w-12 rounded bg-white/5 flex items-center justify-center text-slate-body/30 text-xs">
    -
  </div>
)}
```

**CRITICAL:** Always use `file.name` (NOT `file._id`) when constructing image URLs. The backend stores files with a `name` field representing the actual filename on disk.

### Admin Update Relations Pages

Each entity (country, province, city, user) has a dedicated `/admin/<entity>/[id]/update-relations` page for managing relation/photo fields separately from the edit form. This pattern keeps edit forms focused on text fields and prevents Radix UI Select visual state issues.

**Route Pattern:** `/admin/<entity>/[id]/update-relations`

**Pages:**
- `/admin/countries/[id]/update-relations` — `CountryRelationsForm` with photo picker
- `/admin/provinces/[id]/update-relations` — `ProvinceRelationsForm` with country `AsyncSelect` + photo picker
- `/admin/cities/[id]/update-relations` — `CityRelationsForm` with country/province cascading `AsyncSelect` + photo picker
- `/admin/users/[id]/update-relations` — `UserRelationsForm` with avatar, national card, country/province/city cascading `AsyncSelect`

**Table Action Link:**
Each entity's table (`countries-table.tsx`, `provinces-table.tsx`, `cities-table.tsx`, `users-table.tsx`) has an "Update Relations" action with `ImageUp` icon in the dropdown menu, between Edit and Delete.

**Edit Form Pattern:**
In entity edit forms (e.g., `country-form.tsx`), photo/relation sections are wrapped in `{!isEditing && (...)}` so they only show during creation. During editing, users navigate to the dedicated update-relations page instead.

**`updateRelations.set` parameter format:**
| Entity | Fields in `set` |
|--------|----------------|
| country | `{ _id; photo? }` — photo accepts file ID string |
| province | `{ _id; country?; photo? }` — country accepts relation ID string |
| city | `{ _id; country?; province?; photo? }` — country/province accept relation ID strings |
| user | `{ _id; avatar?; national_card?; province?; city?; country? }` — all accept file/relation ID strings |

### Authentication Flow

All actions automatically handle authentication:

1. **Token Extraction**: Reads JWT token from secure `token` cookie
2. **Header Injection**: `AppApi` adds token to request headers
3. **Backend Validation**: Lesan validates token and enforces permissions

```ts
// Automatic token handling in every action:
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

const result = await AppApi(undefined, token).send({
  /* ... */
});
```

**Note**: Token is sent as `token` header (no "Bearer" prefix) per Lesan convention.

### Response Structure

All Lesan actions return a standardized response:

```ts
{
  success: boolean; // true if operation succeeded
  body: any; // The actual data (type depends on get selection)
}
```

**Standard Action Return:**

All standard actions now return the full response object from Lesan:

```ts
return result; // { success: boolean, body: data }
```

This allows callers to check `result.success` and access `result.body` as needed, providing more flexibility for error handling.

#### Response Body Format: `get` vs Custom-Named Actions

**CRITICAL: The response body format differs between standard `get` actions and custom-named single-record actions.**

- **`act: "get"`** (standard, e.g., country `get`, province `get`, city `get`) → `response.body` is an **array** with one element. Access via `response.body[0]`.
- **`act: "getUser"`, `act: "getMe"`** (custom-named single-record actions) → `response.body` is a **single object**. Access directly via `response.body`.

```ts
// ✅ Standard get (act: "get") — returns array
const response = await get({ _id: id }, { name: 1 });
const entity = response.body[0];  // array access

// ✅ Custom get (act: "getUser") — returns single object
const response = await getUser({ _id: id }, { first_name: 1 });
const user = response.body;  // direct access, NOT response.body[0]
```

Always check whether the action uses `act: "get"` or a custom name (like `getUser`, `getMe`) before deciding how to access `response.body`. When in doubt, check the `act` value in the action file, or check if existing callers use `[0]` indexing.

**Usage Pattern:**

```ts
const result = await add({ name: "Test" }, { _id: 1, name: 1 });

if (result.success) {
  const data = result.body;
  // Handle success
} else {
  // Handle failure
}
```

### Usage Examples

#### Example 1: Create and Fetch Category

```tsx
import { add } from "@/app/actions/category/add";
import { gets } from "@/app/actions/category/gets";

// Server Component
export default async function CategoriesPage() {
  // Fetch all categories
  const result = await gets({ page: 1, limit: 100 }, { _id: 1, name: 1, color: 1 });
  const categories = result.success ? result.body : [];

  return (
    <ul>
      {categories?.map((cat) => (
        <li key={cat._id}>{cat.name}</li>
      ))}
    </ul>
  );
}

// Server Action for form submission
async function createCategory(formData: FormData) {
  "use server";

  const result = await add(
    {
      name: formData.get("name") as string,
      color: formData.get("color") as string,
    },
    { _id: 1, name: 1 },
  );

  if (result.success) {
    redirect("/categories");
  }
}
```

#### Example 2: Update Report with Relations

```tsx
import { update } from "@/app/actions/report/update";

async function updateReport(reportId: string) {
  const result = await update(
    {
      _id: reportId,
      status: "completed",
      priority: "high",
    },
    {
      _id: 1,
      title: 1,
      status: 1,
      priority: 1,
      category: {
        _id: 1,
        name: 1,
      },
      tags: {
        _id: 1,
        name: 1,
      },
    },
  );

  if (result.success) {
    const updatedReport = result.body;
    console.log(updatedReport);
    // {
    //   _id: "...",
    //   title: "...",
    //   status: "completed",
    //   priority: "high",
    //   category: { _id: "...", name: "Technology" },
    //   tags: [{ _id: "...", name: "Urgent" }]
    // }
  }
}
```

#### Example 3: Paginated List with Count

```tsx
import { gets } from "@/app/actions/user/gets";
import { count } from "@/app/actions/user/count";

export default async function UsersList({ page = 1, limit = 20 }) {
  const totalResult = await count({}, { count: 1 });
  const totalUsers = totalResult.success ? totalResult.body : null;

  const usersResult = await gets(
    { page, limit },
    {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      is_verified: 1,
    },
  );
  const users = usersResult.success ? usersResult.body : [];

  const totalPages = Math.ceil((totalUsers?.count || 0) / limit);

  return (
    <div>
      <p>Total: {totalUsers?.count} users</p>
      {/* Render users table */}
    </div>
  );
}
```

### Custom Actions

For complex operations that don't fit the standard CRUD pattern, create custom action files:

```ts
// src/app/actions/report/actions.ts
"use server";

import { AppApi, getToken } from "@/lib/api";

// When adding a report that includes file attachments:
// 1. Files are first uploaded to the server (returning their file IDs).
// 2. A new Document is created in the database containing these file IDs.
// 3. The new Report is created referencing the newly created Document ID (`documentIds`).
export async function createReport(data: {
  title: string;
  description: string;
  location?: { type: string; coordinates: [number, number] };
  priority?: string;
  tags?: string[];
  category?: string;
  documentIds?: string[];
  language?: string;
}) {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  const result = await AppApi(undefined, token).send({
    service: "main",
    model: "report",
    act: "add",
    details: {
      set: {
        title: data.title,
        description: data.description,
        ...(data.language ? { language: data.language } : {}),
        ...(data.location ? { location: data.location } : {}),
        ...(data.tags && data.tags.length > 0 ? { tags: data.tags } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.documentIds && data.documentIds.length > 0 ? { documentIds: data.documentIds } : {}),
      },
      get: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
      },
    },
  });

  return result;
}
```

export async function getMyReports(page = 1, limit = 10) {
const token = await getToken();
if (!token) {
return { success: false, body: [] };
}

const result = await AppApi(undefined, token).send({
service: "main",
model: "report",
act: "gets",
details: {
set: { page, limit },
get: {
\_id: 1,
title: 1,
description: 1,
status: 1,
priority: 1,
createdAt: 1,
},
},
});

return result;
}

````

**When to use custom actions:**

- Authentication flows (login, register, logout)
- Complex business logic spanning multiple models
- File uploads with special handling
- Aggregated queries combining multiple operations
- Custom validation before database operations

### Type Safety with ReqType

The `ReqType` is auto-generated from your Lesan backend and provides complete type safety:

```ts
// Structure: ReqType["<service>"]["<model>"]["<action>"]["<set|get>"]
ReqType["main"]["category"]["add"]["set"]; // Type for creating a category
ReqType["main"]["category"]["get"]["get"]; // Type for selecting category fields
ReqType["main"]["report"]["gets"]["set"]; // Type for fetching reports
````

**Benefits:**

- Autocomplete in your IDE for all available fields
- Compile-time errors for invalid field names
- Automatic updates when backend schema changes
- Zero manual type definitions needed

**Setup:**

1. Configure Lesan to generate types: `deno task gen-types` (or equivalent)
2. Import generated types: `import { ReqType } from "@/types/declarations"`
3. Use `DeepPartial<ReqType[...]["get"]>` for optional field selection

### The AppApi Client

The `AppApi` function (located in `@/lib/api.ts`) is the bridge between Next.js and Lesan:

```ts
export const AppApi = (lesanUrl?: string, token?: string) => {
  // Handles:
  // 1. URL resolution (server-side internal URL vs client-side proxy)
  // 2. Token extraction and header injection
  // 3. Request/response formatting for Lesan protocol
  // 4. Error handling and fallbacks

  return lesanApi({
    URL: lesanUrl || getLesanUrl(),
    baseHeaders: {
      connection: "keep-alive",
      token: token, // No "Bearer" prefix!
    },
  });
};
```

**Key Features:**

- Automatic environment detection (server vs client)
- Internal network routing in production (bypasses public API)
- Client-side proxy support to avoid CORS issues
- Persistent connection headers for performance

### Environment Configuration

Server actions rely on these environment variables:

```bash
# .env.backend
LESAN_URL=http://localhost:1406          # Internal backend URL (server-side)
NEXT_PUBLIC_LESAN_URL=http://localhost:1406  # Public backend URL (client-side)
```

**Server-side:** Uses `LESAN_URL` for direct internal network access  
**Client-side:** Uses `/api/proxy` route to avoid CORS (handled in `AppApi`)

### Best Practices

1. **Always use Server Actions**: Never fetch backend APIs directly from client components
2. **Be explicit with field selection**: Only request fields you need
3. **Handle null returns**: Actions return `null` on failure - always check before accessing properties
4. **Use TypeScript**: Leverage `ReqType` for complete type safety
5. **Keep actions thin**: Actions should only handle API calls - put business logic in Server Components
6. **Group related actions**: Keep model-specific actions in dedicated folders
7. **Validate on both sides**: Client-side validation for UX, server-side for security
8. **Return consistent shapes**: Standard actions return `body`, custom actions may return full response
9. **Use `getToken()` helper**: For custom actions, use the helper instead of repeating cookie logic
10. **Document custom actions**: Add JSDoc comments for complex custom actions

### Migration Guide: Adding a New Model

When adding a new model to your Lesan backend:

1. **Regenerate types**: Run type generation to update `ReqType`
2. **Create action folder**: `src/app/actions/<model>/`
3. **Create standard actions**: Add `add.ts`, `get.ts`, `gets.ts`, `update.ts`, `remove.ts`
4. **Use the template**: Copy the standard pattern and replace `<model>` and `<action>`
5. **Test types**: Ensure TypeScript recognizes `ReqType["main"]["<model>"]`
6. **Add custom actions**: If needed, create special operations in `actions.ts`

### Report and Document Creation Flow

When creating a new report that includes file attachments, follow this specific order of operations to ensure data integrity and proper relationship linking:

1. **Upload Files**: First, upload all selected files to the server using the `uploadFile` server action (e.g., via the `FileUploadField` component). This action will store the files and return their unique file IDs.
2. **Create Document**: Once you have the file IDs, create a new `Document` record in the database (using the `add` document server action). Pass the file IDs to the `documentFileIds` field. This will group the files together and return a new Document ID.
3. **Create Report**: Finally, create the `Report` record. Pass the newly created Document ID(s) to the `documentIds` field in the report's `add` action, along with the title, description, and other report details.

This three-step process ensures that files are securely stored, properly grouped into documents, and correctly linked to the final report.

### Troubleshooting

**Issue: "ReqType has no property..."**

- Solution: Regenerate types from Lesan backend

**Issue: "token is undefined"**

- Solution: Ensure user is logged in and cookie is set
- Check cookie name matches: `cookieStore.get("token")`

**Issue: "result.success is false"**

- Solution: Check backend logs, validate input data matches schema

**Issue: "AppApi not found"**

- Solution: Verify `@/lib/api.ts` exists and exports `AppApi`

### Important Notes

- Use types from `/src/types/declarations` for consistency with the backend.
- **STRICT RULE FOR AI AGENTS**: NEVER use the `any` type in this project. Always resolve and use the proper types, mostly available inside `/src/types/declarations.ts`.
- **STRICT RULE FOR AI AGENTS**: When calling `getTranslations()` in Server Components, you MUST explicitly pass the `locale` parameter (e.g., `await getTranslations({ locale })`). Also, ensure new translation keys are present across ALL available language files in the `/messages` folder.
- Keep the report submission page **simple and elegant**.
- Do not run `pnpm dev` or build commands automatically — only suggest them.

---

## Application Pages & Routes

### War Crimes Exploration Page (`/[locale]/war-crimes`)

The War Crimes Exploration page is the primary public-facing archive for browsing documented war crimes. It is a Server Component that fetches reports with extensive filtering support.

**Route:** `/(fa|en|ar|zh|pt|es|nl|tr|ru)/war-crimes`

**Features:**
- **Tabbed Views**: List view, Map view, Timeline view, and Statistics view
- **Advanced Filters**: Status, priority, category, tags, date range, location bounding box, hostile/attacked countries/provinces/cities, crime occurrence date range, language
- **URL-driven State**: All filters are reflected in query parameters, enabling shareable links and pre-filtered navigation
- **Search**: Full-text search across report titles and descriptions
- **Export**: CSV export of filtered results
- **Pagination**: Server-side paginated list with result counts

**Key Query Parameters:**
| Param | Description |
|-------|-------------|
| `search` | Free-text search |
| `status` | `Pending`, `Approved`, `Rejected`, `InReview` |
| `priority` | `Low`, `Medium`, `High` |
| `categoryId` | Single category ID |
| `tagIds` | Comma-separated tag IDs |
| `dateFrom`, `dateTo` | Report creation date range |
| `crimeOccurredFrom`, `crimeOccurredTo` | Crime occurrence date range |
| `hostileCountryIds` | Comma-separated hostile country IDs |
| `attackedCountryIds` | Comma-separated attacked country IDs |
| `attackedProvinceIds` | Comma-separated attacked province IDs |
| `attackedCityIds` | Comma-separated attacked city IDs |
| `selected_language` | Report language code |
| `view` | `list`, `map`, `timeline`, `statistics` |
| `bbox` | Map bounding box for spatial filtering |

**Pre-filtered Navigation Examples:**
```tsx
// Link to war crimes filtered by a specific tag
<Link href="/war-crimes?tagIds=abc123">Tag Name</Link>

// Link to war crimes filtered by a specific category
<Link href="/war-crimes?categoryId=def456">Category Name</Link>

// Link to war crimes filtered by a specific country
<Link href="/war-crimes?attackedCountryIds=ghi789">Country Name</Link>
```

**Components:**
- `WarCrimesFilters` — Filter sidebar/panel with all filter controls
- `WarCrimesList` — Paginated list of report cards
- `WarCrimesMap` — Interactive Leaflet map with report markers
- `WarCrimesTimeline` — Chronological timeline view
- `WarCrimesStatistics` — Charts and aggregate statistics
- `WarCrimesExport` — CSV export button

### Explore Pages (`/[locale]/explore/*`)

The Explore section provides browsable detail pages for geographic entities involved in documented war crimes. Each page displays war information, related reports, and linked sub-entities.

#### Explore Index (`/[locale]/explore`)
- Searchable grid of all countries
- Shows country name, English name, war history preview, province/city counts
- Links to individual country detail pages

#### Country Detail (`/[locale]/explore/countries/[id]`)
**Route Pattern:** `/(fa|en|...)/explore/countries/:countryId`

**Displays:**
- Country name and English name
- Quick stats (provinces, cities, total reports)
- **War Information** section with rich text fields:
  - `wars_history`, `conflict_timeline`, `casualties_info`, `international_response`
  - `war_crimes_documentation`, `human_rights_violations`, `genocide_info`
  - `chemical_weapons_info`, `displacement_info`, `reconstruction_status`
  - `international_sanctions`, `notable_war_events`
- **Hostile Reports** — Reports where this country is the aggressor
- **Attacked Reports** — Reports where this country is the victim
- **Provinces sidebar** — Linked provinces with navigation
- **Cities sidebar** — Linked cities with navigation

#### Province Detail (`/[locale]/explore/provinces/[id]`)
**Route Pattern:** `/(fa|en|...)/explore/provinces/:provinceId`

**Displays:**
- Province name and English name
- Breadcrumb link to parent country
- Quick stats (cities, total reports)
- **War Information** section (same fields as country, plus `notable_battles`, `occupation_info`, `destruction_level`, `civilian_impact`, `mass_graves_info`, `war_crimes_events`, `liberation_info`)
- **Related Reports** — Reports attacking this province
- **Cities sidebar** — Linked cities with navigation
- **Country sidebar** — Link to parent country

#### City Detail (`/[locale]/explore/cities/[id]`)
**Route Pattern:** `/(fa|en|...)/explore/cities/:cityId`

**Displays:**
- City name and English name
- Breadcrumb links to parent province and country
- Quick stats (total reports)
- **War Information** section (same fields as province)
- **Related Reports** — Reports attacking this city
- **Province sidebar** — Link to parent province
- **Country sidebar** — Link to parent country

### Report Detail Page (`/[locale]/reports/[id]`)

The Report Detail page displays a single war crime report with comprehensive information.

**Route:** `/(fa|en|...)/reports/:reportId`

**Design:**
- Hero header with radial gradient, status/priority/category badges, title, and date metadata
- **Image Gallery Hero** — If documents contain images, they are displayed prominently at the top in a responsive grid layout (1 image = full-width banner, 2 images = side-by-side, 3+ images = masonry grid with featured large image)
- Clickable lightbox for viewing images fullscreen with keyboard navigation (Escape to close, arrow keys to navigate)
- Two-column layout: main content (left) + metadata sidebar (right)

**Clickable Elements:**
- **Category badge** → `/war-crimes?categoryId={id}`
- **Tag badges** → `/war-crimes?tagIds={id}`
- **Hostile countries** → `/explore/countries/{id}`
- **Attacked countries** → `/explore/countries/{id}`
- **Attacked provinces** → `/explore/provinces/{id}`
- **Attacked cities** → `/explore/cities/{id}`

---

## Dashboard & Statistics Architecture

This section covers the admin dashboard and war crimes statistics pages, which display backend aggregation data via chart primitives.

### Chart Primitive Components

Reusable chart components used in both the admin dashboard and war crimes statistics page:

- **`StatCard`** — Glass card with icon, title, and large number value. Links to management pages. Used for raw counts (reports, users, war criminals, etc.).
- **`ProgressRow`** — Horizontal progress bar with label, icon, and count. For binary breakdowns (verified/unverified, published/draft, active/inactive).
- **`MiniBarChart`** — Vertical bar list with labels and counts. For multi-value breakdowns (userByLevel, fileByType, warCriminalByStatus, tagCounts).
- **`TimelineBarChart`** — Timeline bar chart with date labels. Uses `overflow-x-auto` + `min-w-[36px] shrink-0` on items for horizontal scrolling when data overflows.
- **`SectionHeader`** — Section title with icon in a rounded container.

### Admin Dashboard (`/admin/dashboard`)

Uses two backend endpoints:

1. **`dashboardStatistic`** — Returns aggregate counts and breakdowns:
   - Raw counts: `users`, `provinces`, `cities`, `categories`, `tags`, `reports`, `documents`, `blogPosts`, `heroSlides`, `countries`, `files`, `warCriminals`
   - Breakdowns (array of `{ _id, count }`): `userByLevel`, `userByVerification` (`_id: boolean | null`), `reportByStatus`, `reportByPriority`, `reportByLanguage`, `blogPostByStatus`, `heroSlideByStatus`, `fileByType` (includes `totalSize`), `warCriminalByStatus`, `warCriminalByAffiliation`
   - Time series: `reportsLastWeek`, `reportsLastMonth`

2. **`reportStatistics`** — Returns report-specific aggregations: `total`, `statusCounts`, `priorityCounts`, `categoryCounts`, `languageCounts`, `hostileCountryCounts`, `attackedCountryCounts`, `attackedProvinceCounts`, `attackedCityCounts`, `monthlyCounts`, `crimeOccurredMonthlyCounts`, `geographicCounts`

**Interface:**
```ts
interface DashboardStatsBody {
  users?: number; provinces?: number; cities?: number;
  categories?: number; tags?: number;
  reports?: number; documents?: number; blogPosts?: number;
  heroSlides?: number; countries?: number; files?: number; warCriminals?: number;
  userByLevel?: { _id: string; count: number }[];
  userByVerification?: { _id: boolean; count: number }[];
  reportByStatus?: { _id: string; count: number }[];
  reportByPriority?: { _id: string; count: number }[];
  reportByLanguage?: { _id: string; count: number }[];
  blogPostByStatus?: { _id: boolean; count: number }[];
  heroSlideByStatus?: { _id: boolean; count: number }[];
  fileByType?: { _id: string; count: number; totalSize: number }[];
  warCriminalByStatus?: { _id: string; count: number }[];
  warCriminalByAffiliation?: { _id: string; count: number }[];
  reportsLastWeek?: number;
  reportsLastMonth?: number;
}
```

### Null Handling Patterns

Backend responses may include `null` values for `_id` in breakdowns. Handle them explicitly:

```ts
// userByVerification – treat null _id as unverified
const unverifiedCount = userVerificationItems
  .filter(v => v._id === false || v._id === null)
  .reduce((sum, v) => sum + v.count, 0);

// priorityCounts – map null to "Unknown"
statsBody.priorityCounts?.forEach((i) => {
  priorityCounts[i._id || "Unknown"] = i.count;
});
// Then render extra ProgressRow for "Unknown"
{(priorityCounts["Unknown"] ?? 0) > 0 && (
  <ProgressRow key="Unknown" label={t("common.unknown")} ... />
)}
```

### Label Mapping & Translation

Backend returns raw `_id` values (e.g., `"Ordinary"`, `"At Large"`, `"Private Military Company"`). Map them to translated labels before passing to charts:

```ts
// User levels – use existing admin.level_* keys
const userLevelLabel: Record<string, string> = {
  Ordinary: t("admin.level_Ordinary"), Manager: t("admin.level_Manager"),
  Editor: t("admin.level_Editor"), Reporter: t("admin.Reporter"),
  Artist: t("admin.Artist"), Diplomat: t("admin.Diplomat"),
  Researcher: t("admin.Researcher"),
};
const userByLevelItems = (dashBody.userByLevel || []).map((i) => ({
  ...i, _id: userLevelLabel[i._id] || i._id,
}));

// War criminal status – use existing admin.{camelCase} keys
const wcStatusLabel: Record<string, string> = {
  "At Large": t("admin.atLarge"), Deceased: t("admin.Deceased"),
  Accused: t("admin.Accused"), Indicted: t("admin.Indicted"),
  Convicted: t("admin.Convicted"), Sanctioned: t("admin.Sanctioned"),
};

// War criminal affiliation – use existing admin.{camelCase} keys
const wcAffiliationLabel: Record<string, string> = {
  Military: t("admin.Military"), Paramilitary: t("admin.Paramilitary"),
  Government: t("admin.Government"),
  "Rebel Group": t("admin.rebelGroup"),
  "Private Military Company": t("admin.privateMilitaryCompany"),
  Political: t("admin.Political"), Other: t("admin.Other"),
};
```

### War Crimes Statistics (`/[locale]/war-crimes` → Statistics tab)

Uses `reportStatistics` endpoint with additional aggregation fields:

**Interface:**
```ts
interface ReportStatsBody {
  total?: { count: number }[];
  statusCounts?: CountItem[];
  priorityCounts?: CountItem[];
  categoryCounts?: CountItem[];
  languageCounts?: CountItem[];
  hostileCountryCounts?: CountItem[];
  attackedCountryCounts?: CountItem[];
  attackedProvinceCounts?: CountItem[];
  attackedCityCounts?: CountItem[];
  monthlyCounts?: CountItem[];
  crimeOccurredMonthlyCounts?: CountItem[];
  geographicCounts?: GeoCountItem[];
  tagCounts?: CountItem[];
  warCriminalCounts?: CountItem[];
  reporterCounts?: { _id: string; firstName: string; lastName: string; count: number }[];
  weeklyCounts?: CountItem[];
  dailyCounts?: CountItem[];
}
```

### Chart Sections Reference

| Section | Data Source | Component | Translation Keys |
|---------|-------------|-----------|------------------|
| Reports by Status | `statsBody.statusCounts` | `ProgressRow` | `admin.status_pending`, `admin.status_approved`, etc. |
| Reports by Priority | `statsBody.priorityCounts` | `ProgressRow` | `admin.priority_high`, `admin.priority_medium`, `admin.priority_low` |
| Reports by Category | `statsBody.categoryCounts` | `MiniBarChart` | `admin.reportsByCategory` |
| Reports by Language | `statsBody.languageCounts` | `MiniBarChart` | `admin.reportsByLanguage` |
| Users by Level | `dashBody.userByLevel` | `MiniBarChart` | `admin.usersByLevel`, `admin.level_*` |
| Users by Verification | `dashBody.userByVerification` | `ProgressRow` | `admin.verifiedUsers`, `admin.verified`, `admin.unverified` |
| Blog Posts by Status | `dashBody.blogPostByStatus` | `ProgressRow` | `admin.blogByStatus`, `admin.published`, `admin.draft` |
| Hero Slides by Status | `dashBody.heroSlideByStatus` | `ProgressRow` | `admin.heroSlidesByStatus`, `admin.active`, `admin.inactive` |
| Files by Type | `dashBody.fileByType` | Custom bar with icon + size | `admin.filesByType` |
| War Criminals by Status | `dashBody.warCriminalByStatus` | `MiniBarChart` | `admin.warCriminalStatus`, `admin.atLarge`, etc. |
| War Criminals by Affiliation | `dashBody.warCriminalByAffiliation` | `MiniBarChart` | `admin.warCriminalAffiliation`, `admin.Military`, etc. |
| Monthly Timeline | `statsBody.monthlyCounts` | `TimelineBarChart` | `admin.monthlyCreated` |
| Weekly Timeline | `statsBody.weeklyCounts` | `TimelineBarChart` | `warCrimes.weeklyTimeline` |
| Daily Timeline | `statsBody.dailyCounts` | `TimelineBarChart` | `warCrimes.dailyTimeline` |
| Tags | `statsBody.tagCounts` | `MiniBarChart` | `warCrimes.byTag` |
| War Criminals (stats) | `statsBody.warCriminalCounts` | `MiniBarChart` | (section title) |
| Top Reporters | `statsBody.reporterCounts` | List card | `warCrimes.topReporters` |

---

## Design System & Theming

### New Theme Direction (`new-theme/THEME.md`)

The project has a documented new theme direction located at `new-theme/THEME.md`. This defines the visual evolution of the platform toward a **premium, ultra-modern dark aesthetic** suitable for a solemn war crimes documentation platform.

#### Core Principles
- **Mood**: Solemn, authoritative, trustworthy, emotionally impactful, memorial-like
- **Background**: Deep charcoal / near-black (`#0a0a0a`)
- **Primary Accent**: Crimson / Blood Red (`#991b1b`) — represents justice and urgency
- **Secondary Accent**: Subtle warm gold / amber (`#d4af37`) — represents hope and remembrance
- **Text**: Off-white (`#f1f5f9`) for headings, softer gray (`#cbd5e1`) for body

#### CSS Custom Properties (Tailwind v4 `@theme`)
The theme is implemented via CSS custom properties in `globals.css`:
```
--color-background: hsl(0 0% 4%)
--color-foreground: hsl(210 40% 96%)
--color-primary: hsl(0 72% 35%)    /* crimson */
--color-secondary: hsl(45 80% 52%) /* gold */
--color-crimson: #991b1b
--color-crimson-light: #b91c1c
--color-gold: #d4af37
--color-offwhite: #f1f5f9
--color-slate-body: #cbd5e1
```

#### Glassmorphism Cards
The design uses consistent glass-like card surfaces:
- **`.glass-strong`**: Higher opacity background for sidebars and emphasis cards
- **`.glass-light`**: Lower opacity background for content sections
- Both use `backdrop-blur` and subtle white borders (`border-white/[0.06]`)

#### Hero Pattern
Public-facing detail pages (country, province, city, report) share a consistent hero header pattern:
```
<div className="relative pt-32 pb-12 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_70%)]" />
  <div className="container relative">...</div>
</div>
```

This radial gradient creates a subtle crimson glow behind the page title, establishing visual hierarchy and thematic consistency.

---

## Localized War Info Fields (Country, Province, City)

The backend stores war information fields on Country, Province, and City models as **multi-language objects** (not plain strings). Each field stores content per language key.

### Data Shape

```json
{
  "wars_history": {
    "fa": "<p>متن فارسی...</p>",
    "en": "<p>English text...</p>",
    "ar": "<p>نص عربي...</p>"
  }
}
```

Only populated language keys are stored — MongoDB doesn't persist `undefined` keys.

### Country Fields (12)
`wars_history`, `conflict_timeline`, `casualties_info`, `international_response`, `war_crimes_documentation`, `human_rights_violations`, `genocide_info`, `chemical_weapons_info`, `displacement_info`, `reconstruction_status`, `international_sanctions`, `notable_war_events`

### Province/City Fields (10)
`wars_history`, `conflict_timeline`, `casualties_info`, `notable_battles`, `occupation_info`, `destruction_level`, `civilian_impact`, `mass_graves_info`, `war_crimes_events`, `liberation_info`

### Admin Form Pattern

When a backend field becomes a localized object:

1. **Zod schema**: Each war field becomes `z.object({ fa: z.string().optional(), en: ..., ... }).optional()`
2. **UI**: Tabbed RichTextEditor with one tab per language (fa, en, ar, zh, pt, es, nl, tr, ru) using shadcn/ui `Tabs`
3. **Form submission**: Build object from flat form values, omit empty keys:
   ```ts
   const buildLocalizedObject = (values: FormValues, fieldName: string) => {
     const obj: Record<string, string> = {};
     for (const lang of LANGUAGES) {
       const val = (values as unknown as Record<string, Record<string, string> | undefined>)[fieldName]?.[lang];
       if (val && val.trim()) obj[lang] = val;
     }
     return Object.keys(obj).length > 0 ? obj : undefined;
   };
   ```
4. **Pre-fill on edit**: Extract language-specific content from objects, with backward compatibility for old string values:
   ```ts
   const extractLangValue = (field: Record<string, string> | string | undefined, lang: string): string => {
     if (typeof field === "object" && field !== null) return field[lang] || "";
     if (typeof field === "string") return lang === "en" ? field : "";
     return "";
   };
   ```

### Public Pages Pattern

When displaying localized war info fields on public explore pages:

```ts
const fieldValue = (entity as Record<string, unknown>)[field] as Record<string, string> | string | undefined;
const value = typeof fieldValue === "object" && fieldValue !== null
  ? (fieldValue[locale] || fieldValue.en || "")
  : typeof fieldValue === "string"
    ? fieldValue
    : "";
```

**Fallback strategy:** current locale → English → empty string.

---

## Server Actions: Filter vs Field Selection

### Two Distinct Parameters

When calling `gets` server actions, understand the difference between `filter` (in `set`) and field selection (in `get`):

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `set.filter` | **Backend filtering** — tells the backend which records to return | `{ filter: { selected_language: locale } }` |
| `get` | **Field projection** — tells the backend which fields to include in the response | `{ _id: 1, title: 1, selected_language: 1 }` |

### Common Pitfall

If you want to filter by a field AND use that field in your code:
1. Include it in `filter` to narrow down results
2. Include it in `get` to receive it in the response

```ts
// ✅ CORRECT: Filter by selected_language AND request it in response
const res = await gets(
  { page: 1, limit: 10, filter: { selected_language: locale } },
  { _id: 1, title: 1, selected_language: 1 }
);

// ❌ WRONG: Only requesting field without filtering (returns all records)
const res = await gets(
  { page: 1, limit: 10 },
  { _id: 1, title: 1, selected_language: 1 }
);

// ❌ WRONG: Filtering but not requesting field (can't access selected_language in code)
const res = await gets(
  { page: 1, limit: 10, filter: { selected_language: locale } },
  { _id: 1, title: 1 }
);

---

## Admin Panel Best Practices

### Standard Page Pattern (Server Component)

Every admin listing page follows this structure:

```
src/app/admin/<entity>/
├── page.tsx              # Server Component: fetch data, pass to client
├── _components/          # Shared sub-components
│   └── <entity>-card.tsx # Glass card for grid view
├── <entity>-table.tsx    # Table component (extracted from client)
├── admin-<entity>-client.tsx  # Client component: view toggle, pagination, actions
└── loading.tsx           # Skeleton loading state
```

**`page.tsx`** — Fetches data, computes `prevPageUrl`/`nextPageUrl`, passes everything to client:
```tsx
export default async function AdminPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;

  // Build query string for pagination URLs
  const buildQuery = (overrides) => {
    const sp = new URLSearchParams();
    // push active params...
    return sp.toString();
  };

  const result = await gets(setQuery, projection);
  const items = result.success ? result.body : [];

  const queryString = buildQuery({});
  const prevPageUrl = page > 1 ? `/admin/<entity>?page=${page - 1}${queryString ? `&${queryString}` : ""}` : "";
  const nextPageUrl = items.length >= limit ? `/admin/<entity>?page=${page + 1}${queryString ? `&${queryString}` : ""}` : "";

  return <AdminClient items={items} prevPageUrl={prevPageUrl} nextPageUrl={nextPageUrl} />;
}
```

**`admin-<entity>-client.tsx`** — `"use client"` component with:
- `viewMode` state (`"grid" | "table"`)
- Grid/table toggle buttons (LayoutGrid / Table2 icons, crimson active state)
- Bulk action bar visible only in table mode (`viewMode === "table"`)
- URL-based pagination via `<Link href={prevPageUrl}>` and `<Link href={nextPageUrl}>`
- Uses extracted `<EntityTable>` with `onDelete`/`onPreview` callbacks
- Uses `<EntityCard>` with `onDelete`/`onApprove`/`onReject` callbacks

### Grid/Table Toggle Pattern

```tsx
const [viewMode, setViewMode] = useState<"grid" | "table">("table");

<div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 p-0.5">
  <Button variant="ghost" size="sm" onClick={() => setViewMode("grid")}
    className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-crimson text-white hover:bg-crimson-light" : "text-slate-body hover:text-offwhite hover:bg-white/5"}`}
  >
    <LayoutGrid className="h-4 w-4" />
  </Button>
  <Button variant="ghost" size="sm" onClick={() => { setViewMode("table"); setSelectedIds([]); }}
    className={`h-8 w-8 p-0 ${viewMode === "table" ? "bg-crimson text-white hover:bg-crimson-light" : "text-slate-body hover:text-offwhite hover:bg-white/5"}`}
  >
    <Table2 className="h-4 w-4" />
  </Button>
</div>
```

### Card Component Pattern (`_components/<entity>-card.tsx`)

- Extends `motion.div` with `initial={{ opacity: 0, y: 12 }}` / `animate={{ opacity: 0, y: 0 }}` animations
- Uses `glass-strong` with `border-white/[0.06]` and `hover:border-white/[0.12]`
- Receives `onDelete`, `onApprove`, `onReject` etc. callbacks from parent (never imports server actions directly)
- Reuses shared helpers (e.g., `getImageUploadUrl`, `formatFileSize`, `getFileTypeKey`)
- Stays self-contained with local status/priority config maps

### **CRITICAL: Translation Key Safety**

**Always guard `t()` calls with existence checks to prevent `MISSING_MESSAGE` errors:**

```tsx
// ✅ SAFE — Skip badge when field is undefined/null/empty
{report.status && (
  <span>{t(`status_${statusKey}`)}</span>
)}
{report.priority && (
  <span>{t(`priority_${priorityKey}`)}</span>
)}

// ✅ SAFE — Fallback for optional enum fields
const key = user.level ? `level_${user.level}` : "level_Ordinary";
<span>{t(key)}</span>
```

**Never call `t(`prefix_${dynamic}`)` where `dynamic` can be `""`**, as `t("prefix_")` will throw a `MISSING_MESSAGE` error. This applies to status, priority, level, and any other enum-typed backend fields that may be absent.

### Pagination URL Pattern

Use `prevPageUrl`/`nextPageUrl` string props computed server-side, NOT client-side `navigate()`:

```tsx
// ✅ CORRECT — URL-based pagination
{prevPageUrl ? (
  <Button variant="outline" size="sm" asChild className="...">
    <Link href={prevPageUrl}>{t("previous")}</Link>
  </Button>
) : (
  <Button variant="outline" size="sm" disabled className="...">
    {t("previous")}
  </Button>
)}
```

This ensures pagination works with server-side data refetching and preserves all query params.

### Hero Header Pattern

Every admin listing page has a consistent hero header:

```tsx
<div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
  <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-8 bg-crimson" />
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">{t("adminPanel")}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">{t("entityManagement")}</h1>
      <p className="text-slate-body mt-1 text-sm">{t("entityManagementDescription")}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Link href={`/admin/entity/new`}>
        <Button className="bg-crimson hover:bg-crimson-light text-white">
          <Plus className="h-4 w-4 me-1.5" />
          {t("addEntity")}
        </Button>
      </Link>
    </div>
  </div>
</div>
```

### Translation Keys Checklist

When adding a new admin entity page, ensure these translation keys exist in ALL 9 language files under the `admin` namespace:

| Key | Purpose |
|-----|---------|
| `entityManagement` | Page title (e.g., "Reports Management") |
| `entityManagementDescription` | Subtitle description |
| `addEntity` | Create button label |
| `searchEntity` | Search placeholder |
| `noEntity` | Empty state text |
| `noEntityFiltered` | Empty filtered results text |
| `entityUpdated` | Success toast on update |
| `entityDeleted` | Success toast on delete |
| `entityDeleted_plural` | Bulk delete success |
| `itemsShown` | Result count label |
| `noResults` | No results text |
| `exportCsv` | CSV export button |
| `previous` / `next` | Pagination labels |
| `status_*` / `priority_*` | Enum badge translations |
| `allStatuses` / `allPriorities` | Filter "all" options |

### Loading Skeleton Layout

Match the skeleton structure to the actual page layout:

```tsx
export default function EntityLoading() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Hero */}
      <div className="rounded-2xl glass-light p-6 border border-white/[0.06] space-y-4">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl glass-light p-4 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Search/toggle bar */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b border-white/[0.04]">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md ms-auto" />
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
```
```
