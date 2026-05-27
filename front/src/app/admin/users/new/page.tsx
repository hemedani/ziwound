import { redirect } from "next/navigation";
import { addUser } from "@/app/actions/user/addUser";
import { UserCreateClient } from "../_components/user-create-client";

const LANG_CODES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"];

function buildLocalized(values: Record<string, string> | undefined): Record<string, string> | undefined {
  if (!values) return undefined;
  const obj: Record<string, string> = {};
  for (const lang of LANG_CODES) {
    const val = values[lang];
    if (val?.trim()) obj[lang] = val;
  }
  return Object.keys(obj).length > 0 ? obj : undefined;
}

export default async function AdminUserNewPage() {
  async function handleCreate(formData: FormData) {
    "use server";

    const data = JSON.parse(formData.get("data") as string);

    const res = await addUser(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        gender: data.gender,
        level: data.level,
        is_verified: data.is_verified,
        verified: data.verified,
        isPublic: data.isPublic,
        address: data.address || undefined,
        verificationBadge: data.verificationBadge || undefined,
        bio: buildLocalized(data.bio),
        expertise: data.expertise && data.expertise.length > 0 ? data.expertise : undefined,
        ...(data.avatarId ? { avatarId: data.avatarId } : {}),
      },
      { _id: 1, first_name: 1, last_name: 1, email: 1 },
    );

    if (res?.success) {
      redirect("/admin/users");
    }

    return res;
  }

  return <UserCreateClient onSubmit={handleCreate} />;
}
