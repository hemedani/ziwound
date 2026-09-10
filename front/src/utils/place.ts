import { get as getCity } from "@/app/actions/city/get";

export interface EmbeddedPlace {
  country?: { _id?: string; name?: string };
  city?: { _id?: string; name?: string };
}

type CityLookup = {
  name?: string;
  country?: { _id?: string; name?: string };
};

export async function resolvePlaceLabel(place: EmbeddedPlace): Promise<string> {
  const cityId = place.city?._id;

  if (cityId) {
    const res = await getCity(
      { _id: cityId },
      { name: 1, country: { _id: 1, name: 1 } },
    );
    const body = res?.success ? (res.body as CityLookup[] | undefined) : undefined;
    const city = Array.isArray(body) ? body[0] : undefined;

    const cityName = city?.name || place.city?.name;
    const countryName = city?.country?.name;

    if (cityName && countryName && countryName !== cityName) {
      return `${cityName}, ${countryName}`;
    }
    if (cityName) return cityName;
  }

  return place.country?.name || "";
}
