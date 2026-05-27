import { get } from "@/app/actions/city/get";
import { notFound } from "next/navigation";
import { CityEditClient } from "../../_components/city-edit-client";

export default async function AdminCityEditPage({
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
      notable_battles: 1,
      occupation_info: 1,
      destruction_level: 1,
      civilian_impact: 1,
      mass_graves_info: 1,
      war_crimes_events: 1,
      liberation_info: 1,
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const city = Array.isArray(response.body) ? response.body[0] : response.body;
  if (!city) notFound();

  return <CityEditClient city={city} />;
}
