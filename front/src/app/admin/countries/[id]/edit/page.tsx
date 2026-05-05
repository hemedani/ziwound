import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/country/get";
import { EditCountryForm } from "../../_components/edit-country-form";
import { notFound } from "next/navigation";

interface EditCountryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCountryPage({ params }: EditCountryPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin");

  const response = await get(
    { _id: id },
    {
      _id: 1,
      name: 1,
      english_name: 1,
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      international_response: 1,
      war_crimes_documentation: 1,
      human_rights_violations: 1,
      genocide_info: 1,
      chemical_weapons_info: 1,
      displacement_info: 1,
      reconstruction_status: 1,
      international_sanctions: 1,
      notable_war_events: 1,
    }
  );

  if (!response?.success || !response.body || !Array.isArray(response.body) || response.body.length === 0) {
    notFound();
  }

  const country = response.body[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("editCountry") || "Edit Country"}
        </h1>
        <p className="text-muted-foreground">
          {t("editCountryDescription") || "Update country information and war description fields"}
        </p>
      </div>
      <div className="max-w-4xl">
        <EditCountryForm country={country} />
      </div>
    </div>
  );
}
