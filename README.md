# Ziwound

A full-stack war crimes documentation system built with Deno (backend) and Next.js 16 (frontend). The application enables secure report submission, exploration of documented war crimes, blog articles, and a comprehensive admin panel for content management.

## Architecture

```
ziwound/
├── back/                 # Deno backend (Lesan framework + MongoDB)
│   ├── models/           # Data model definitions
│   ├── src/             # API routes and business logic
│   ├── declarations/    # Generated type declarations
│   └── utils/           # Utility functions
├── front/               # Next.js 16 frontend
│   ├── src/             # Application source code
│   ├── public/          # Static assets
│   └── messages/        # Internationalization translation files
├── docker-compose.yml   # Production Docker configuration
└── docker-compose.dev.yml # Development Docker configuration
```

## Tech Stack

### Backend
- **Runtime**: Deno
- **Framework**: Lesan (MongoDB-based ODM/ORM)
- **Database**: MongoDB
- **Authentication**: JWT (jose/djwt library)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI)
- **State Management**: Zustand + React Context
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl (9 languages)
- **Theme**: next-themes (dark/light/system)

## Key Features

### Core Functionality
- **War Crimes Exploration**: Advanced search and filtering of documented incidents
- **Report Submission**: Secure multi-language form with file attachments, location, and metadata
- **Blog Section**: Articles and updates with categories and tags
- **Admin Panel**: Full-featured dashboard for managing reports, documents, blog posts, and users

### Internationalization
Supports **nine languages** with full RTL/LTR layout flipping:
- Persian (fa) - Default, RTL
- English (en)
- Arabic (ar) - RTL
- Chinese (zh)
- Portuguese (pt)
- Spanish (es)
- Dutch (nl)
- Turkish (tr)
- Russian (ru)

### Additional Features
- JWT-based authentication with role-based access control (Ghost, Manager, Editor, Ordinary)
- Progressive Web App (PWA) capabilities
- Interactive mapping with MapLibre GL and Leaflet
- Server Actions for secure backend communication
- Dark/light theme support
- Responsive mobile-first design

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Docker & Docker Compose (for containerized setup)
- Deno (for manual backend development)
- MongoDB (for manual backend development)

### Docker-based Development

```bash
# Start all services with live reloading
docker-compose -f docker-compose.dev.yml up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:1405
# - MongoDB: localhost:27017
```

### Manual Development

**Backend:**
```bash
cd back/
deno task bc-dev
```

**Frontend:**
```bash
cd front/
pnpm install
pnpm dev
```

### Production Deployment

```bash
# Build and run with Docker
docker-compose up --build

# Or build frontend separately
cd front/
pnpm build
pnpm start
```

## Environment Configuration

The application uses separate environment files:

### Backend (.env.backend)
- `MONGO_URI`: MongoDB connection string (default: `mongodb://127.0.0.1:27017/`)
- `APP_PORT`: Server port (default: 1405)
- `ENV`: Environment mode (development/production)

### Frontend
- `LESAN_URL`: Internal backend URL (server-side)
- `NEXT_PUBLIC_LESAN_URL`: Public backend URL (client-side)
- `NEXT_PUBLIC_APP_URL`: Public app URL (for image proxy)
- `APP_PORT`: Application port (default: 3005 in Docker)

## Data Models

The backend defines the following core models:

- **Users**: Authentication and authorization
- **Files**: File upload management
- **Places**: Location-based entities with GeoJSON
- **Categories**: Categorization system
- **Provinces/Cities/City Zones**: Geographic hierarchy
- **Tags**: Metadata categorization
- **Reports**: War crime reports (title, description, attachments, location, status, priority)
- **Documents**: Supporting documents related to reports
- **Blog Posts**: Blog articles with content, author, cover image, publish status

## API Documentation

The backend provides an interactive API playground at `/playground` (when running) for exploring and testing endpoints.

### API Request Format

```json
{
  "service": "main",
  "model": "report",
  "act": "add",
  "details": {
    "set": { /* input data */ },
    "get": { /* projection */ }
  }
}
```

## Development Conventions

### Frontend
- Use **Server Actions** for all backend communication
- Follow clean code practices and remove unused code
- Use shadcn/ui components as the foundation
- All forms: React Hook Form + Zod validation
- Test thoroughly in both RTL (fa) and LTR (en) modes

### Backend
- Use Lesan framework patterns for data modeling
- TypeScript with strict typing
- Zod-like validation syntax for schemas
- One-direction relationships only
- Separate pure field updates from relation updates

## License

This project is for documentation and archival purposes related to war crimes research and human rights documentation.