import { get } from "@/app/actions/category/get";
import { notFound } from "next/navigation";
import { categorySchema } from "@/types/declarations";
import { CategoryEditClient } from "./category-edit-client";

export default async function AdminCategoryEditPage({
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
      description: 1,
      color: 1,
      icon: 1,
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const category = Array.isArray(response.body) ? response.body[0] : response.body;
  if (!category) notFound();

  return <CategoryEditClient category={category} />;
}
