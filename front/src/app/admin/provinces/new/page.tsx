import { getTranslations } from "next-intl/server";
import { gets as getCountries } from "@/app/actions/country/gets";
import { NewProvinceForm } from "../_components/new-province-form";

export default async function NewProvincePage() {
  const t = await getTranslations("admin");
  
  const countriesResponse = await getCountries(
    { page: 1, limit: 1000 },
    { _id: 1, name: 1, english_name: 1 }
  );

  const countries = (countriesResponse?.success && Array.isArray(countriesResponse.body))
    ? countriesResponse.body
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("addProvince") || "Add New Province"}
        </h1>
        <p className="text-muted-foreground">
          {t("addProvinceDescription") || "Create a new province with war description information"}
        </p>
      </div>
      <div className="max-w-4xl">
        <NewProvinceForm countries={countries} />
      </div>
    </div>
  );
}
