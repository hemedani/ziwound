import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { add } from "@/app/actions/tag/add";
import { TagCreateClient } from "./tag-create-client";

export default async function AdminTagNewPage() {
  const t = await getTranslations("admin");

  async function handleCreate(formData: FormData) {
    "use server";

    const data = JSON.parse(formData.get("data") as string);

    const res = await add(
      {
        name: data.name,
        description: data.description || "",
        ...(data.color ? { color: data.color } : {}),
        ...(data.icon ? { icon: data.icon } : {}),
      },
      { _id: 1, name: 1 },
    );

    if (res?.success) {
      redirect("/admin/tags");
    }

    return res;
  }

  return <TagCreateClient onSubmit={handleCreate} />;
}
