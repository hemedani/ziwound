import { get } from "@/app/actions/province/get";
import { notFound } from "next/navigation";
import { ProvinceEditClient } from "../../_components/province-edit-client";

export default async function AdminProvinceEditPage({
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

  const province = Array.isArray(response.body) ? response.body[0] : response.body;
  if (!province) notFound();

  return <ProvinceEditClient province={province} />;
}
