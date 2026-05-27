import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/warCriminal/get";
import { notFound } from "next/navigation";
import { WarCriminalEditClient } from "./war-criminal-edit-client";

export default async function AdminWarCriminalEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const { id } = await params;

  const response = await get(
    { _id: id },
    {
      _id: 1,
      fullName: 1,
      aliases: 1,
      dateOfBirth: 1,
      nationality: 1,
      affiliation: 1,
      rankOrPosition: 1,
      knownFor: 1,
      biography: 1,
      description: 1,
      status: 1,
      convictionDetails: 1,
      isEntity: 1,
      photo: { _id: 1, name: 1 },
      tags: { _id: 1, name: 1 },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const wc = Array.isArray(response.body) ? response.body[0] : response.body;
  if (!wc) notFound();

  return (
    <WarCriminalEditClient wc={wc} />
  );
}
