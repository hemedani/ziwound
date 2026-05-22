# Frontend Changes for Backend Dashboard & Statistics Updates

The backend has been updated with new fields in `dashboardStatistic` and `report.statistics`. Here's exactly what changed and where to apply it on the frontend.

---

## 1. Admin Dashboard (`src/app/admin/dashboard/page.tsx`)

The `dashboardStatistic` call currently requests only `{ users, provinces, cities, categories, tags }`:

```ts
dashboardStatistic(
  {},
  { users: 1, provinces: 1, cities: 1, categories: 1, tags: 1 }
)
```

Update the `get` projection to include all new fields and expand `DashboardStatsBody`:

```ts
dashboardStatistic({}, {
  users: 1, provinces: 1, cities: 1, categories: 1, tags: 1,
  reports: 1, documents: 1, blogPosts: 1, heroSlides: 1, countries: 1, files: 1, warCriminals: 1,
  userByLevel: 1, userByVerification: 1,
  reportByStatus: 1, reportByPriority: 1, reportByLanguage: 1,
  blogPostByStatus: 1, heroSlideByStatus: 1, fileByType: 1,
  warCriminalByStatus: 1, warCriminalByAffiliation: 1,
  reportsLastWeek: 1, reportsLastMonth: 1,
})
```

### Types to add to `DashboardStatsBody`:

```ts
interface DashboardStatsBody {
  // Existing
  users?: number; provinces?: number; cities?: number;
  categories?: number; tags?: number;
  // New raw counts
  reports?: number; documents?: number; blogPosts?: number;
  heroSlides?: number; countries?: number; files?: number; warCriminals?: number;
  // New breakdowns
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

### What to add visually:

- **New StatCards for raw counts**: Add `warCriminals`, `blogPosts`, `heroSlides`, `countries`, `files` to the `topStats` grid (or secondary row).
- **Report By Status chart**: Use `ProgressRow` with existing `statusCfg` — the data now comes directly from `dashStatsBody.reportByStatus` instead of `statsBody.statusCounts` if you prefer, or keep using `statsBody.statusCounts` from report statistics — your choice.
- **Report By Priority chart**: Same as above, `dashStatsBody.reportByPriority`.
- **Users By Level chart**: New `MiniBarChart` section with label "Users by Level" — shows Ghost/Manager/Editor/Reporter/etc distribution. Note: Ghost level is already excluded by the backend.
- **Users By Verification chart**: New `ProgressRow` showing verified vs unverified users.
- **Blog Posts chart**: New `ProgressRow` for published vs unpublished.
- **Hero Slides chart**: New `ProgressRow` for active vs inactive.
- **Files By Type chart**: New `MiniBarChart` showing count per type (image/video/docs) with total storage in bytes.
- **War Criminal By Status chart**: New `MiniBarChart` showing Accused/Indicted/Convicted/etc.
- **War Criminal By Affiliation chart**: New `MiniBarChart` showing Military/Government/etc.
- **Reports Last Week/Month**: New `StatCard`s showing 7-day and 30-day counts.

Keep the same existing chart layout pattern (glass cards, `SectionHeader`, `MiniBarChart`, `ProgressRow`).

---

## 2. War Crimes Statistics (`src/components/war-crimes/war-crimes-statistics.tsx`)

The `report.statistics` response now includes new facets. Expand `ReportStatsBody`:

```ts
interface ReportStatsBody {
  // Existing
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
  // New
  tagCounts?: CountItem[];
  warCriminalCounts?: CountItem[];
  reporterCounts?: { _id: string; firstName: string; lastName: string; count: number }[];
  weeklyCounts?: CountItem[];
  dailyCounts?: CountItem[];
}
```

### What to add visually:

- **Tag Counts**: New `MiniBarChart` section with `Tag` icon showing top 50 tags.
- **War Criminal Counts**: New `MiniBarChart` section showing top 50 war criminals by name.
- **Top Reporters**: New section listing top 20 reporters (show `firstName lastName` + count). Use a simple list card, similar to "Top Locations".
- **Weekly Timeline**: New `TimelineBarChart` alongside the monthly one. Label as "Weekly Created Reports".
- **Daily Timeline**: New `TimelineBarChart` (optional, granular) — can be placed on a third column or accordion.

---

## 3. Landing Page (`src/app/[locale]/page.tsx`)

The `dashboardStatistic` call currently requests `{ reports, documents, countries, cities, provinces }`. Consider adding `warCriminals` to show on the `ImpactStats` component if desired.

No other changes needed unless you want to enrich the stats display.

---

## 4. Generate Updated TypeScript Declarations

Run the backend to regenerate declarations — this auto-updates `ReqType` so server actions stay fully typed:

```bash
cd back && deno run --allow-all mod.ts
```

After that, ReqType at `src/types/declarations.ts` will include all new response fields for both `dashboardStatistic` and `statistics`.

---

## 5. Add New i18n Translation Keys

Add to all 9 language files in `messages/`:

| Key | English Value | Context |
|-----|--------------|---------|
| `admin.warCriminals` | "War Criminals" | Stat card |
| `admin.usersByLevel` | "Users by Level" | Chart section |
| `admin.verifiedUsers` | "Verified Users" | Chart section |
| `admin.reportsByStatus` | "Reports by Status" | Chart section (or reuse existing) |
| `admin.reportsByPriority` | "Reports by Priority" | Chart section (or reuse existing) |
| `admin.reportsByLanguage` | "Reports by Language" | Chart section |
| `admin.blogByStatus` | "Blog Posts by Status" | Chart section |
| `admin.heroSlidesByStatus` | "Hero Slides by Status" | Chart section |
| `admin.filesByType` | "Files by Type" | Chart section |
| `admin.warCriminalStatus` | "War Criminals by Status" | Chart section |
| `admin.warCriminalAffiliation` | "War Criminals by Affiliation" | Chart section |
| `admin.reportsLastWeek` | "Reports (7 days)" | Stat card |
| `admin.reportsLastMonth` | "Reports (30 days)" | Stat card |
| `warCrimes.byTag` | "By Tag" | Chart section |
| `warCrimes.topReporters` | "Top Reporters" | Section |
| `warCrimes.weeklyTimeline` | "Weekly Created" | Timeline section |
| `warCrimes.dailyTimeline` | "Daily Created" | Timeline section |
| `warCrimes.totalReporter` | "Reporters" | Stat card |

---

## Existing Component Reference

All reusable components are already available:

- **`StatCard`** — glass card showing a number + icon (for raw counts like warCriminals, reportsLastWeek)
- **`ProgressRow`** — horizontal progress bar with icon (for binary breakdowns like verified/unverified, published/unpublished, active/inactive)
- **`MiniBarChart`** — vertical bar list with labels (for multi-value breakdowns like userByLevel, fileByType, warCriminalByStatus, tagCounts)
- **`TimelineBarChart`** — timeline bar chart (for weeklyCounts, dailyCounts)
- **`SectionHeader`** — section title with icon

No new UI primitives needed — compose these with the new data fields.
