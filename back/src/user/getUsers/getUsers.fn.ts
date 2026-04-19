import type { ActFn, Document } from "lesan";
import { user } from "../../../mod.ts";

export const getUsersFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      level,
      levels,
      isVerified,
      gender,
      sortBy,
      sortOrder,
    },
    get,
  } = body.details;

  const pipeline: Document[] = [];

  // Text search using MongoDB text index
  search &&
    pipeline.push({
      $match: { $text: { $search: search } },
    });

  // Single level filter
  level &&
    pipeline.push({
      $match: { level },
    });

  // Multiple levels filter
  levels && levels.length > 0 &&
    pipeline.push({
      $match: { level: { $in: levels } },
    });

  // Verification status filter
  isVerified && isVerified !== "all" &&
    pipeline.push({
      $match: { isVerified: isVerified === "true" },
    });

  // Gender filter
  gender &&
    pipeline.push({
      $match: { gender },
    });

  // Add text search score for sorting if search term exists
  if (search && (!sortBy || sortBy === "relevance")) {
    pipeline.push({
      $addFields: {
        textScore: { $meta: "textScore" },
      },
    });
  }

  // Sorting
  const sortField = sortBy === "relevance" ? "textScore" : (sortBy || "_id");
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortField]: sortDirection } });

  // Pagination
  const calculatedSkip = skip ?? limit * (page - 1);
  pipeline.push({ $skip: calculatedSkip });
  pipeline.push({ $limit: limit });

  return await user
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};
