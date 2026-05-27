import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/tag/get";
import { notFound } from "next/navigation";
import { tagSchema } from "@/types/declarations";
import { TagEditClient } from "./tag-edit-client";

export default async function AdminTagEditPage({
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
      name: 1,
      description: 1,
      color: 1,
      icon: 1,
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const tag = Array.isArray(response.body) ? response.body[0] : response.body;
  if (!tag) notFound();

  return (
    <TagEditClient tag={tag} />
  );
}
