import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      isActive,
      selected_language,
      page = 1,
      limit = 20,
      sortBy = "order",
      sortOrder = "asc",
    },
    get,
  } = body.details;

  const pipeline: object[] = [];

  // Filter by isActive if provided
  if (isActive !== undefined) {
    const isActiveBool = isActive === "true" || isActive === true;
    pipeline.push({ $match: { isActive: isActiveBool } });
  }

  // Filter by language if provided
  if (selected_language) {
    pipeline.push({ $match: { selected_language } });
  }

  // Sort
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortBy]: sortDirection } });

  // Pagination
  const skip = limit * (page - 1);
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  return await heroSlide.aggregation({
    pipeline,
    projection: get,
  }).toArray();
};
