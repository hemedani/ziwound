import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/country/get";
import { CountryRelationsForm } from "../../_components/country-relations-form";
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
      photo: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
    }
  );

  if (!response?.success || !response.body || !Array.isArray(response.body) || response.body.length === 0) {
    notFound();
  }

  const country = response.body[0];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/countries"
          className="inline-flex items-center gap-2 text-sm text-slate-body hover:text-offwhite transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToCountries") || "Back to Countries"}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-offwhite">
          {t("updateCountryRelations") || "Update Country Relations"}
        </h1>
        <p className="text-slate-body mt-1">
          {t("updateCountryRelationsDescription")}{country.name || country.english_name}
        </p>
      </div>
      <div className="max-w-2xl">
        <CountryRelationsForm country={country} />
      </div>
    </div>
  );
}
