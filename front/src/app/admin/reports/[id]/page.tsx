import { notFound } from "next/navigation";
import { get as getReport } from "@/app/actions/report/get";
import { ReportDetailClient } from "./report-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getReport(
    { _id: id },
    { _id: 1, title: 1 }
  );
  const report = res?.success && Array.isArray(res.body) ? res.body[0] : null;
  const title = report?.title || "Report Details";
  return {
    title: `${title} — ZiWound Admin`,
    description: `Manage report: ${title}`,
  };
}

const reportProjection = {
  _id: 1,
  title: 1,
  description: 1,
  status: 1,
  priority: 1,
  selected_language: 1,
  crime_occurred_at: 1,
  createdAt: 1,
  updatedAt: 1,
  address: 1,
  location: 1,
  category: { _id: 1, name: 1, color: 1, icon: 1 },
  tags: { _id: 1, name: 1, color: 1, icon: 1 },
  reporter: {
    _id: 1,
    first_name: 1,
    last_name: 1,
    email: 1,
    level: 1,
    is_verified: 1,
    avatar: { _id: 1, name: 1, type: 1 },
    province: { _id: 1, name: 1 },
    city: { _id: 1, name: 1 },
  },
  documents: {
    _id: 1,
    title: 1,
    description: 1,
    selected_language: 1,
    documentFiles: {
      _id: 1,
      name: 1,
      type: 1,
      mimeType: 1,
      alt_text: 1,
    },
  },
  hostileCountries: { _id: 1, name: 1 },
  attackedCountries: { _id: 1, name: 1 },
  attackedProvinces: { _id: 1, name: 1 },
  attackedCities: { _id: 1, name: 1 },
  warCriminals: {
    _id: 1,
    fullName: 1,
    status: 1,
    aliases: 1,
    nationality: 1,
    affiliation: 1,
    rankOrPosition: 1,
    knownFor: 1,
    description: 1,
    isEntity: 1,
    photo: { _id: 1, name: 1, mimeType: 1, type: 1 },
  },
} as const;

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await getReport({ _id: id }, reportProjection);
  if (!res?.success || !Array.isArray(res.body) || !res.body[0]) {
    notFound();
  }

  const report = res.body[0] as Record<string, unknown>;

  return <ReportDetailClient report={report} reportId={id} />;
}
