import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { regionalManagerRequest } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: { search, status, areaType, userIds, createdAtFrom, createdAtTo },
  } = body.details;

  const filters: Document = {};

  if (search) filters["$text"] = { $search: search };
  if (status) filters.status = status;
  if (areaType) filters.areaType = areaType;

  if (userIds && userIds.length > 0) {
    filters["user._id"] = {
      $in: userIds.map((id: string) => new ObjectId(id)),
    };
  }

  if (createdAtFrom) filters.createdAt = { $gte: createdAtFrom };
  if (createdAtTo) {
    filters.createdAt = {
      ...(filters.createdAt as object),
      $lte: createdAtTo,
    };
  }

  const foundedItemsLength = await regionalManagerRequest.countDocument({
    filter: filters,
  });

  return { qty: foundedItemsLength };
};
