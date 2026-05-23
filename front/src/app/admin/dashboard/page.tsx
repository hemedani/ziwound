import { getTranslations } from "next-intl/server";
import { count as countReports } from "@/app/actions/report/count";
import { count as countDocuments } from "@/app/actions/document/count";
import { statistics as reportStatistics } from "@/app/actions/report/statistics";
import { dashboardStatistic } from "@/app/actions/user/dashboardStatistic";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { gets as getReports } from "@/app/actions/report/gets";
import { getMe } from "@/app/actions/user/getMe";
import { DashboardClient } from "@/components/admin/dashboard-client";
import { DeepPartial, reportSchema } from "@/types/declarations";

/* ─── Types ─── */
interface CountItem {
  _id: string;
  count: number;
}
interface GeoCountItem {
  _id: { lng: number; lat: number };
  count: number;
}

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
}

interface DashboardStatsBody {
  users?: number;
  provinces?: number;
  cities?: number;
  categories?: number;
  tags?: number;
  reports?: number;
  documents?: number;
  blogPosts?: number;
  heroSlides?: number;
  countries?: number;
  files?: number;
  warCriminals?: number;
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

export const metadata = {
  title: "Dashboard — ZiWound Admin",
  description: "Admin command center for ZiWound war crimes documentation platform",
};

export default async function AdminDashboardPage() {
  const t = await getTranslations({ locale: "fa" });

  const meRes = await getMe({
    _id: 1,
    first_name: 1,
    last_name: 1,
    level: 1,
  });
  const userData = meRes.success && meRes.body
    ? { first_name: meRes.body.first_name, last_name: meRes.body.last_name, level: meRes.body.level || "Ordinary" }
    : { first_name: "", last_name: "", level: "Ordinary" };

  const [
    reportsCountRes,
    documentsCountRes,
    blogPostsRes,
    recentReportsRes,
    statsRes,
    dashStatsRes,
  ] = await Promise.all([
    countReports({}, { qty: 1 }),
    countDocuments({}, { qty: "1" }),
    getBlogPosts({ page: 1, limit: 1 }, { _id: 1 }),
    getReports(
      { page: 1, limit: 5 },
      {
        _id: 1,
        title: 1,
        status: 1,
        createdAt: 1,
        category: { name: 1 },
      },
    ),
    reportStatistics({}, {}),
    dashboardStatistic(
      {},
      {
        users: 1,
        provinces: 1,
        cities: 1,
        categories: 1,
        tags: 1,
        reports: 1,
        documents: 1,
        blogPosts: 1,
        heroSlides: 1,
        countries: 1,
        files: 1,
        warCriminals: 1,
        userByLevel: 1,
        userByVerification: 1,
        reportByStatus: 1,
        reportByPriority: 1,
        reportByLanguage: 1,
        blogPostByStatus: 1,
        heroSlideByStatus: 1,
        fileByType: 1,
        warCriminalByStatus: 1,
        warCriminalByAffiliation: 1,
        reportsLastWeek: 1,
        reportsLastMonth: 1,
      },
    ),
  ]);

  const totalReports =
    reportsCountRes?.success && typeof reportsCountRes.body === "object"
      ? (reportsCountRes.body as { qty?: number }).qty ?? 0
      : 0;
  const totalDocuments =
    documentsCountRes?.success && typeof documentsCountRes.body === "object"
      ? (documentsCountRes.body as { qty?: number }).qty ?? 0
      : 0;

  let totalBlogPosts = 0;
  if (blogPostsRes?.success) {
    const body = blogPostsRes.body;
    if (Array.isArray(body)) totalBlogPosts = body.length;
    else if (typeof body === "object" && body !== null) {
      totalBlogPosts =
        (body as { total?: number; list?: unknown[] }).total ??
        (body as { list?: unknown[] }).list?.length ??
        0;
    }
  }

  let recentReports: DeepPartial<reportSchema>[] = [];
  if (recentReportsRes?.success) {
    const body = recentReportsRes.body;
    recentReports = Array.isArray(body)
      ? body
      : (body as { list?: DeepPartial<reportSchema>[] })?.list || [];
  }

  const statsBody: ReportStatsBody =
    statsRes?.success && typeof statsRes.body === "object"
      ? (statsRes.body as ReportStatsBody)
      : {};

  const dashBody: DashboardStatsBody =
    dashStatsRes?.success && typeof dashStatsRes.body === "object"
      ? (dashStatsRes.body as DashboardStatsBody)
      : {};

  return (
    <DashboardClient
      statsBody={statsBody}
      dashBody={dashBody}
      totalReports={totalReports}
      totalDocuments={totalDocuments}
      totalBlogPosts={totalBlogPosts}
      recentReports={recentReports}
      userData={userData}
    />
  );
}
