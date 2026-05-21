import { getTranslations } from "next-intl/server";
import { getUser } from "@/app/actions/user/getUser";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { UserRelationsForm } from "../../_components/user-relations-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UpdateRelationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateRelationsPage({ params }: UpdateRelationsPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin");

  const response = await getUser(
    { _id: id },
    {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      avatar: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
      national_card: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
      country: { _id: 1, name: 1, english_name: 1 },
      province: { _id: 1 },
      city: { _id: 1 },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const user = response.body;

  const [countriesResponse, provincesResponse, citiesResponse] = await Promise.all([
    getCountries({ page: 1, limit: 1000 }, { _id: 1, name: 1, english_name: 1 }),
    getProvinces({ page: 1, limit: 1000 }, { _id: 1, name: 1, english_name: 1, country: { _id: 1 } }),
    getCities({ page: 1, limit: 2000 }, { _id: 1, name: 1, english_name: 1, province: { _id: 1 } }),
  ]);

  const countries = (countriesResponse?.success && Array.isArray(countriesResponse.body)) ? countriesResponse.body : [];
  const provinces = (provincesResponse?.success && Array.isArray(provincesResponse.body)) ? provincesResponse.body : [];
  const cities = (citiesResponse?.success && Array.isArray(citiesResponse.body)) ? citiesResponse.body : [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-slate-body hover:text-offwhite transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToUsers") || "Back to Users"}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-offwhite">
          {t("updateUserRelations") || "Update User Relations"}
        </h1>
        <p className="text-slate-body mt-1">
          {t("updateUserRelationsDescription")}{user.first_name} {user.last_name}
        </p>
      </div>
      <div className="max-w-2xl">
        <UserRelationsForm user={user} countries={countries} provinces={provinces} cities={cities} />
      </div>
    </div>
  );
}
