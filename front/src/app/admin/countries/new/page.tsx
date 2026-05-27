import { redirect } from "next/navigation";
import { add } from "@/app/actions/country/add";
import { getTranslations } from "next-intl/server";
import { CountryCreateClient } from "./country-create-client";

export default async function AdminCountryNewPage() {
  const t = await getTranslations("admin");

  async function handleCreate(formData: FormData) {
    "use server";

    const data = JSON.parse(formData.get("data") as string);

    const buildLocalized = (values: Record<string, string> | undefined) => {
      if (!values) return undefined;
      const obj: Record<string, string> = {};
      const LANG_CODES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"];
      for (const lang of LANG_CODES) {
        const val = values[lang];
        if (val?.trim()) obj[lang] = val;
      }
      return Object.keys(obj).length > 0 ? obj : undefined;
    };

    const res = await add(
      {
        name: data.name,
        english_name: data.english_name,
        wars_history: buildLocalized(data.wars_history),
        conflict_timeline: buildLocalized(data.conflict_timeline),
        casualties_info: buildLocalized(data.casualties_info),
        international_response: buildLocalized(data.international_response),
        war_crimes_documentation: buildLocalized(data.war_crimes_documentation),
        human_rights_violations: buildLocalized(data.human_rights_violations),
        genocide_info: buildLocalized(data.genocide_info),
        chemical_weapons_info: buildLocalized(data.chemical_weapons_info),
        displacement_info: buildLocalized(data.displacement_info),
        reconstruction_status: buildLocalized(data.reconstruction_status),
        international_sanctions: buildLocalized(data.international_sanctions),
        notable_war_events: buildLocalized(data.notable_war_events),
        ...(data.photoId ? { photoId: data.photoId } : {}),
      },
      { _id: 1, name: 1 },
    );

    if (res?.success) {
      redirect("/admin/countries");
    }

    return res;
  }

  return <CountryCreateClient onSubmit={handleCreate} />;
}
