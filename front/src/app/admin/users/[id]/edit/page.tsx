import { getUser } from "@/app/actions/user/getUser";
import { notFound } from "next/navigation";
import { UserEditClient } from "../../_components/user-edit-client";

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getUser(
    { _id: id },
    {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      gender: 1,
      level: 1,
      address: 1,
      is_verified: 1,
      verified: 1,
      isPublic: 1,
      birth_date: 1,
      summary: 1,
      bio: 1,
      expertise: 1,
      verificationBadge: 1,
      avatar: { _id: 1, name: 1 },
      national_card: { _id: 1, name: 1 },
      country: { _id: 1 },
      province: { _id: 1 },
      city: { _id: 1 },
      createdAt: 1,
      updatedAt: 1,
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const user = response.body;

  return <UserEditClient user={user} />;
}
