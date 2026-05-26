import { getTranslations } from "next-intl/server";
import { get as getReport } from "@/app/actions/report/get";
import { gets as getTags } from "@/app/actions/tag/gets";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { gets as getWarCriminals } from "@/app/actions/warCriminal/gets";
import { gets as getDocuments } from "@/app/actions/document/gets";
import { notFound } from "next/navigation";
import { ReportEditClient } from "./report-edit-client";

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
  tags: { _id: 1, name: 1 },
  reporter: { _id: 1, first_name: 1, last_name: 1 },
  documents: { _id: 1, title: 1, description: 1, selected_language: 1 },
  hostileCountries: { _id: 1, name: 1 },
  attackedCountries: { _id: 1, name: 1 },
  attackedProvinces: { _id: 1, name: 1 },
  attackedCities: { _id: 1, name: 1 },
  warCriminals: { _id: 1, fullName: 1, status: 1, photo: { _id: 1, name: 1, type: 1 } },
} as const;

export const metadata = {
  title: "Edit Report — ZiWound Admin",
};

export default async function AdminReportEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const { id } = await params;

  const res = await getReport({ _id: id }, reportProjection);
  if (!res?.success || !Array.isArray(res.body) || !res.body[0]) {
    notFound();
  }

  const report = res.body[0] as Record<string, unknown>;

  const [tagsRes, categoriesRes, countriesRes, provincesRes, citiesRes, warCriminalsRes, docsRes] =
    await Promise.all([
      getTags({ page: 1, limit: 500 }, { _id: 1, name: 1 }),
      getCategories({ page: 1, limit: 500 }, { _id: 1, name: 1 }),
      getCountries({ page: 1, limit: 500 }, { _id: 1, name: 1 }),
      getProvinces({ page: 1, limit: 500 }, { _id: 1, name: 1 }),
      getCities({ page: 1, limit: 500 }, { _id: 1, name: 1 }),
      getWarCriminals({ page: 1, limit: 500 }, { _id: 1, fullName: 1, status: 1 }),
      getDocuments({ page: 1, limit: 500 }, { _id: 1, title: 1, description: 1, selected_language: 1 }),
    ]);

  const extractList = (res: { success: boolean; body: unknown }) =>
    res?.success && Array.isArray(res.body) ? res.body : [];

  return (
    <ReportEditClient
      report={report}
      reportId={id}
      allTags={extractList(tagsRes) as any}
      allCategories={extractList(categoriesRes) as any}
      allCountries={extractList(countriesRes) as any}
      allProvinces={extractList(provincesRes) as any}
      allCities={extractList(citiesRes) as any}
      allWarCriminals={extractList(warCriminalsRes) as any}
      allDocuments={extractList(docsRes) as any}
    />
  );
}
