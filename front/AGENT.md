# Ziwound Frontend - Next.js Application

## Project Overview

Ziwound frontend is a Next.js 16 application for a war crimes documentation system. It features a war crimes exploration page for searching and exploring documented war crimes, a blog section for articles and updates, a simple and beautiful multi-language report submission page (title, attachments, description, tags, location + minor fields), and a full-featured advanced admin panel for managing reports, documents, blog posts, and users.

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

```bash
# Install dependencies with pnpm
pnpm install

# Run the development server (uses Turbopack)
pnpm dev
```

The app will be available at `http://localhost:3000` (or the configured port).

### Production Build

The project is configured to use Next.js `standalone` output mode for highly optimized Docker builds.
In production (`Dockerfile`), we extract `.next/standalone` and run it natively via `node server.js` without reinstalling `node_modules`.

```bash
pnpm build
pnpm start
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

#### Feedback & Display Components

- **Toast** (`toast.tsx`) - Notification toasts with `useToast` hook:
  - `Toast`, `ToastProvider`, `ToastViewport`
  - `ToastTitle`, `ToastDescription`, `ToastClose`, `ToastAction`
  - Use via: `const { toast } = useToast(); toast({ title: "Success", description: "..." })`
- **Toaster** (`toaster.tsx`) - Toast container (add to root layout)
- **Badge** (`badge.tsx`) - Status indicators and tags (default, secondary, destructive, outline)
- **Avatar** (`avatar.tsx`) - User profile images:
  - `Avatar`, `AvatarImage`, `AvatarFallback`

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

- **EmojiPicker** (`tag-form.tsx`) - Integrated `emoji-picker-react` via `next/dynamic` for icons

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
- Role-based access (Normal, Editor, Manager, Ghost – Ghost has highest privileges).
- Auth state managed via React Context + Zustand where needed.

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
- When adding translations: add keys to **all** language files.
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
getImageUrl("uploads/images/filename.jpg")
// => "/api/image-proxy?path=uploads/images/filename.jpg"

// Specific for uploaded files (auto-appends folder)
getImageUploadUrl("filename.jpg", "image")
// => "/api/image-proxy?path=uploads/images/filename.jpg"

getImageUploadUrl("file.pdf", "docs")
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
/>
```

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
- Ghost user level has full admin access.
- Keep the report submission page **simple and elegant**.
- Do not run `pnpm dev` or build commands automatically — only suggest them.
