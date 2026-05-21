import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/city/get";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { CityRelationsForm } from "../../_components/city-relations-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UpdateRelationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateRelationsPage({ params }: UpdateRelationsPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin");

  const response = await get(
    { _id: id },
    {
      _id: 1,
      name: 1,
      english_name: 1,
      country: { _id: 1, name: 1, english_name: 1 },
      province: { _id: 1 },
      photo: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
    }
  );

  if (!response?.success || !response.body || !Array.isArray(response.body) || response.body.length === 0) {
    notFound();
  }

  const city = response.body[0];

  const [countriesResponse, provincesResponse] = await Promise.all([
    getCountries({ page: 1, limit: 1000 }, { _id: 1, name: 1, english_name: 1 }),
    getProvinces({ page: 1, limit: 1000 }, { _id: 1, name: 1, english_name: 1, country: { _id: 1 } }),
  ]);

  const countries = (countriesResponse?.success && Array.isArray(countriesResponse.body))
    ? countriesResponse.body
    : [];

  const provinces = (provincesResponse?.success && Array.isArray(provincesResponse.body))
    ? provincesResponse.body
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/cities"
          className="inline-flex items-center gap-2 text-sm text-slate-body hover:text-offwhite transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToCities") || "Back to Cities"}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-offwhite">
          {t("updateCityRelations") || "Update City Relations"}
        </h1>
        <p className="text-slate-body mt-1">
          {t("updateCityRelationsDescription")}{city.name || city.english_name}
        </p>
      </div>
      <div className="max-w-2xl">
        <CityRelationsForm city={city} countries={countries} provinces={provinces} />
      </div>
    </div>
  );
}
