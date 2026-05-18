import type { ActFn, Document } from "lesan";
import { warCriminal } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: { search, status, affiliation, isEntity },
    get,
  } = body.details;

  const filters: Document = {};

  if (search) filters["$text"] = { $search: search };
  if (status) filters.status = status;
  if (affiliation) filters.affiliation = affiliation;
  if (isEntity !== undefined) filters.isEntity = isEntity;

  const foundedItemsLength = await warCriminal.countDocument({
    filter: filters,
  });

  return { qty: foundedItemsLength };
};
