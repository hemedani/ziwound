import { getTranslations } from "next-intl/server";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { NewCityForm } from "../_components/new-city-form";

export default async function NewCityPage() {
  const t = await getTranslations("admin");
  
  const provincesResponse = await getProvinces(
    { page: 1, limit: 1000 },
    { _id: 1, name: 1, english_name: 1 }
  );

  const provinces = (provincesResponse?.success && Array.isArray(provincesResponse.body))
    ? provincesResponse.body
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("addCity") || "Add New City"}
        </h1>
        <p className="text-muted-foreground">
          {t("addCityDescription") || "Create a new city with war description information"}
        </p>
      </div>
      <div className="max-w-4xl">
        <NewCityForm provinces={provinces} />
      </div>
    </div>
  );
}
