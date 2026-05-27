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
      province: { _id: 1, name: 1, english_name: 1 },
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/cities"
              className="text-slate-body hover:text-offwhite transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("citiesManagement") || "Cities"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
            {t("updateCityRelations") || "Update City Relations"}
          </h1>
          <p className="text-slate-body mt-1 text-sm">
            {t("updateCityRelationsDescription") || "Manage relations for "}{city.name || city.english_name}
          </p>
        </div>
      </div>

      <CityRelationsForm city={city} countries={countries} provinces={provinces} />
    </div>
  );
}
