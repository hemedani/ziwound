import { type ActFn, ObjectId } from "lesan";
import { city, coreApp } from "../../../mod.ts";
import type { MyContext } from "@lib";

type CityItem = {
  _id?: string;
  provinceId: string;
  countryId: string;
  [key: string]: unknown;
};

type Group = {
  provinceId: string;
  countryId: string;
  docs: Record<string, unknown>[];
};

/**
 * Bulk-insert cities.
 *
 * `insertMany` applies one relation payload to the whole batch, so items are
 * grouped by their `(province, country)` parent pair. Provinces are the natural
 * batching unit: every city of a province shares the same two parents.
 *
 * NOTE: the `isCapital` flag cannot be set here — it is a reverse-relation flag
 * on the parent province and `insertMany` can only apply one uniform value per
 * batch. Use `city.add` for individual capitals.
 */
export const addManyFn: ActFn = async (body) => {
  const { set: { items, linkRelated }, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as MyContext;

  if (!items || items.length === 0) return [];

  const groups = new Map<string, Group>();

  for (const item of items as CityItem[]) {
    const { provinceId, countryId, _id, ...rest } = item;
    const key = `${provinceId}::${countryId}`;
    if (!groups.has(key)) {
      groups.set(key, {
        provinceId: String(provinceId),
        countryId: String(countryId),
        docs: [],
      });
    }
    groups.get(key)!.docs.push({
      ...(_id ? { _id: new ObjectId(_id) } : {}),
      ...rest,
    });
  }

  const inserted: Record<string, unknown>[] = [];

  for (const { provinceId, countryId, docs } of groups.values()) {
    const result = await city.insertMany({
      docs,
      relations: {
        registrar: {
          _ids: user._id,
        },
        province: {
          _ids: new ObjectId(provinceId),
          relatedRelations: {
            cities: linkRelated,
            // `capital` is a single reverse relation and can only be set per
            // document, so bulk imports never claim a capital. Use `city.add`
            // for a province's capital city.
            capital: false,
          },
        },
        country: {
          _ids: new ObjectId(countryId),
          relatedRelations: {
            cities: linkRelated,
          },
        },
      },
      // Idempotent bulk insert — see country/addMany for rationale.
      options: { ordered: false },
      projection: get,
    });
    inserted.push(...result);
  }

  return inserted;
};
