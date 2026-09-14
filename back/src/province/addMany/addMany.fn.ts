import { type ActFn, ObjectId } from "lesan";
import { coreApp, province } from "../../../mod.ts";
import type { MyContext } from "@lib";

type ProvinceItem = {
  _id?: string;
  countryId: string;
  [key: string]: unknown;
};

/**
 * Bulk-insert provinces.
 *
 * The ODM `insertMany` applies a single relation payload to every document in
 * the batch, so items are grouped by their `countryId` first and each group is
 * inserted with its own `country` relation (which also feeds the reverse
 * `provinces` array on the country).
 */
export const addManyFn: ActFn = async (body) => {
  const { set: { items }, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as MyContext;

  if (!items || items.length === 0) return [];

  const groups = new Map<string, Record<string, unknown>[]>();

  for (const item of items as ProvinceItem[]) {
    const { countryId, _id, ...rest } = item;
    const key = String(countryId);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({
      ...(_id ? { _id: new ObjectId(_id) } : {}),
      ...rest,
    });
  }

  const inserted: Record<string, unknown>[] = [];

  for (const [countryId, docs] of groups) {
    const result = await province.insertMany({
      docs,
      relations: {
        registrar: {
          _ids: user._id,
        },
        country: {
          _ids: new ObjectId(countryId),
          relatedRelations: {
            provinces: true,
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
