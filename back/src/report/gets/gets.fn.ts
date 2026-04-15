import type { ActFn, Document } from "@deps";
import { ObjectId } from "@deps";
import { report } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      status,
      priority,
      categoryIds,
      tagIds,
      userIds,
      createdAtFrom,
      createdAtTo,
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

  // Status filter
  status &&
    pipeline.push({
      $match: { status },
    });

  // Priority filter
  priority &&
    pipeline.push({
      $match: { priority },
    });

  // Category filter (array of IDs)
  categoryIds && categoryIds.length > 0 &&
    pipeline.push({
      $match: { "category._id": { $in: categoryIds.map((id: string) => new ObjectId(id)) } },
    });

  // Tag filter (array of IDs)
  tagIds && tagIds.length > 0 &&
    pipeline.push({
      $match: { "tags._id": { $in: tagIds.map((id: string) => new ObjectId(id)) } },
    });

  // User/Reporter filter (array of IDs)
  userIds && userIds.length > 0 &&
    pipeline.push({
      $match: { "reporter._id": { $in: userIds.map((id: string) => new ObjectId(id)) } },
    });

  // Date range filters
  createdAtFrom &&
    pipeline.push({
      $match: { createdAt: { $gte: createdAtFrom } },
    });

  createdAtTo &&
    pipeline.push({
      $match: { createdAt: { $lte: createdAtTo } },
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

  return await report
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};
