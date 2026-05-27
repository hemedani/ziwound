import { redirect } from "next/navigation";
import { add } from "@/app/actions/city/add";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { getTranslations } from "next-intl/server";
import { CityCreateClient } from "../_components/city-create-client";

export default async function AdminCityNewPage() {
  const t = await getTranslations("admin");

  const [countriesResponse, provincesResponse] = await Promise.all([
    getCountries({ page: 1, limit: 1000 }, { _id: 1, name: 1, english_name: 1 }),
    getProvinces({ page: 1, limit: 1000 }, { _id: 1, name: 1, english_name: 1, country: { _id: 1 } }),
  ]);

  const countries = countriesResponse?.success && Array.isArray(countriesResponse.body)
    ? countriesResponse.body
    : [];

  const provinces = provincesResponse?.success && Array.isArray(provincesResponse.body)
    ? provincesResponse.body
    : [];

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
        countryId: data.countryId,
        provinceId: data.provinceId,
        isCapital: false,
        ...(data.photoId ? { photoId: data.photoId } : {}),
        wars_history: buildLocalized(data.wars_history),
        conflict_timeline: buildLocalized(data.conflict_timeline),
        casualties_info: buildLocalized(data.casualties_info),
        notable_battles: buildLocalized(data.notable_battles),
        occupation_info: buildLocalized(data.occupation_info),
        destruction_level: buildLocalized(data.destruction_level),
        civilian_impact: buildLocalized(data.civilian_impact),
        mass_graves_info: buildLocalized(data.mass_graves_info),
        war_crimes_events: buildLocalized(data.war_crimes_events),
        liberation_info: buildLocalized(data.liberation_info),
      },
      { _id: 1, name: 1 },
    );

    if (res?.success) {
      redirect("/admin/cities");
    }

    return res;
  }

  return <CityCreateClient onSubmit={handleCreate} countries={countries} provinces={provinces} />;
}
