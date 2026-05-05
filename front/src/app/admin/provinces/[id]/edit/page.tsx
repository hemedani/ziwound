import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/province/get";
import { gets as getCountries } from "@/app/actions/country/gets";
import { EditProvinceForm } from "../../_components/edit-province-form";
import { notFound } from "next/navigation";

interface EditProvincePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProvincePage({ params }: EditProvincePageProps) {
  const { id } = await params;
  const t = await getTranslations("admin");

  const response = await get(
    { _id: id },
    {
      _id: 1,
      name: 1,
      english_name: 1,
      country: {
        _id: 1,
      },
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      notable_battles: 1,
      occupation_info: 1,
      destruction_level: 1,
      civilian_impact: 1,
      mass_graves_info: 1,
      war_crimes_events: 1,
      liberation_info: 1,
    }
  );

  const countriesResponse = await getCountries(
    { page: 1, limit: 1000 },
    { _id: 1, name: 1, english_name: 1 }
  );

  if (!response?.success || !response.body || !Array.isArray(response.body) || response.body.length === 0) {
    notFound();
  }

  const province = response.body[0];
  const countries = (countriesResponse?.success && Array.isArray(countriesResponse.body))
    ? countriesResponse.body
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("editProvince") || "Edit Province"}
        </h1>
        <p className="text-muted-foreground">
          {t("editProvinceDescription") || "Update province information and war description fields"}
        </p>
      </div>
      <div className="max-w-4xl">
        <EditProvinceForm province={province} countries={countries} />
      </div>
    </div>
  );
}
