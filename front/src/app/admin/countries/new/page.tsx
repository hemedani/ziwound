import { getTranslations } from "next-intl/server";
import { NewCountryForm } from "../_components/new-country-form";

export default async function NewCountryPage() {
  const t = await getTranslations("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("addCountry") || "Add New Country"}
        </h1>
        <p className="text-muted-foreground">
          {t("addCountryDescription") || "Create a new country with war description information"}
        </p>
      </div>
      <div className="max-w-4xl">
        <NewCountryForm />
      </div>
    </div>
  );
}
