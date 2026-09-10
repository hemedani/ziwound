import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { regionalManagerRequest } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      status,
      areaType,
      userIds,
      createdAtFrom,
      createdAtTo,
      sortBy,
      sortOrder,
    },
    get,
  } = body.details;

  const pipeline: Document[] = [];

  if (search) {
    pipeline.push({ $match: { $text: { $search: search } } });
  }

  if (status) {
    pipeline.push({ $match: { status } });
  }

  if (areaType) {
    pipeline.push({ $match: { areaType } });
  }

  if (userIds && userIds.length > 0) {
    pipeline.push({
      $match: { "user._id": { $in: userIds.map((id: string) => new ObjectId(id)) } },
    });
  }

  if (createdAtFrom) {
    pipeline.push({ $match: { createdAt: { $gte: createdAtFrom } } });
  }

  if (createdAtTo) {
    pipeline.push({ $match: { createdAt: { $lte: createdAtTo } } });
  }

  if (search && (!sortBy || sortBy === "relevance")) {
    pipeline.push({ $addFields: { textScore: { $meta: "textScore" } } });
  }

  const sortField = sortBy === "relevance" ? "textScore" : (sortBy || "_id");
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortField]: sortDirection } });

  const calculatedSkip = skip ?? limit * (page - 1);
  pipeline.push({ $skip: calculatedSkip });
  pipeline.push({ $limit: limit });

  return await regionalManagerRequest
    .aggregation({ pipeline, projection: get })
    .toArray();
};
