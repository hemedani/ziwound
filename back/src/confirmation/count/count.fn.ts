import type { ActFn, Document } from "lesan";
import { confirmation } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: { search, type, isVerified, authorId, reportId },
    get,
  } = body.details;

  const filters: Document = {};

  if (search) filters["$text"] = { $search: search };
  if (type) filters.type = type;
  if (isVerified !== undefined) filters.isVerified = isVerified;

  const foundedItemsLength = await confirmation.countDocument({
    filter: filters,
  });

  return { qty: foundedItemsLength };
};
