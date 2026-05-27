import { get } from "@/app/actions/country/get";
import { notFound } from "next/navigation";
import { CountryEditClient } from "./country-edit-client";

export default async function AdminCountryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const country = Array.isArray(response.body) ? response.body[0] : response.body;
  if (!country) notFound();

  return <CountryEditClient country={country} />;
}
