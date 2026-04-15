import type { ActFn, Document } from "@deps";
import { document } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: { search },
    get,
  } = body.details;

  const filters: Document = {};

  search && (filters["$text"] = { $search: search });

  const foundedItemsLength = await document.countDocument({
    filter: filters,
  });

  return { qty: foundedItemsLength };
};
