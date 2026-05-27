import { redirect } from "next/navigation";
import { add } from "@/app/actions/category/add";
import { CategoryCreateClient } from "./category-create-client";

export default async function AdminCategoryNewPage() {
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
      redirect("/admin/categories");
    }

    return res;
  }

  return <CategoryCreateClient onSubmit={handleCreate} />;
}
