"use client";

import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import type {
  AsyncSelectLoadResult,
  AsyncSelectOption,
} from "@/components/form/async-select";

/**
 * Server-side location search for the admin selects.
 *
 * The world import seeds ~153k cities, so no admin dropdown can preload the
 * full list any more. These helpers query the backend instead, which keeps the
 * payload tiny and lets the user find any of the 152,970 cities.
 *
 * They use the `name` filter (a case-insensitive regex over the native or the
 * English name) rather than the `search` text index, so partial words match the
 * way a typeahead should. `name` is fast on countries (250) and provinces
 * (5,308); for the unscoped city case the parent-relation indexes added in
 * `back/models/city.ts` keep it quick.
 */

const LIMIT = 50;

type LocationRow = { _id: string; name?: string; english_name?: string };

function extractRows(response: unknown): LocationRow[] {
  const body = (response as { body?: unknown } | null)?.body;
  if (Array.isArray(body)) return body as LocationRow[];
  if (body && typeof body === "object") {
    const list = (body as { list?: unknown }).list;
    if (Array.isArray(list)) return list as LocationRow[];
  }
  return [];
}

function toOptions(rows: LocationRow[]): AsyncSelectOption[] {
  return rows.map((row) => {
    const name = (row.name || "").trim();
    const english = (row.english_name || "").trim();
    return {
      id: row._id,
      label: name || english || row._id,
      subLabel: name && english && name !== english ? english : undefined,
    };
  });
}

/** Search countries by name. */
export const searchCountries = async (
  inputValue: string,
): Promise<AsyncSelectLoadResult> => {
  const response = await getCountries(
    { page: 1, limit: LIMIT, ...(inputValue ? { name: inputValue } : {}) },
    { _id: 1, name: 1, english_name: 1 },
  );
  return { options: toOptions(extractRows(response)), hasMore: false };
};

/** Search provinces by name, optionally narrowed to one country. */
export const searchProvinces = (
  countryId?: string,
): ((inputValue: string) => Promise<AsyncSelectLoadResult>) => {
  return async (inputValue: string) => {
    const response = await getProvinces(
      {
        page: 1,
        limit: LIMIT,
        ...(countryId ? { countryIds: [countryId] } : {}),
        ...(inputValue ? { name: inputValue } : {}),
      },
      { _id: 1, name: 1, english_name: 1 },
    );
    return { options: toOptions(extractRows(response)), hasMore: false };
  };
};

/** Search cities by name, optionally narrowed to one province or country. */
export const searchCities = (
  provinceId?: string,
  countryId?: string,
): ((inputValue: string) => Promise<AsyncSelectLoadResult>) => {
  return async (inputValue: string) => {
    const response = await getCities(
      {
        page: 1,
        limit: LIMIT,
        // A city search with no parent scope is a full collection scan over
        // ~153k rows, which is slow enough to time out on a cold cache. The
        // parent relation indexes make a scoped search an index lookup, so
        // callers should always pass whichever of these they have.
        ...(provinceId ? { provinceIds: [provinceId] } : {}),
        ...(!provinceId && countryId ? { countriesId: [countryId] } : {}),
        ...(inputValue ? { name: inputValue } : {}),
      },
      { _id: 1, name: 1, english_name: 1 },
    );
    return { options: toOptions(extractRows(response)), hasMore: false };
  };
};

/** Build a single seeded option so an existing selection keeps its label. */
export const seededLocationOption = (
  id?: string | null,
  name?: string | null,
  englishName?: string | null,
): AsyncSelectOption[] => {
  if (!id) return [];
  const label = (name || "").trim() || (englishName || "").trim() || id;
  const english = (englishName || "").trim();
  return [
    {
      id,
      label,
      subLabel: label !== english && english ? english : undefined,
    },
  ];
};
