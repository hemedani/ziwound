import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { warCriminal } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      status,
      affiliation,
      isEntity,
      tagIds,
      nationality,
      createdAtFrom,
      createdAtTo,
      sortBy,
      sortOrder,
    },
    get,
  } = body.details;

  const pipeline: Document[] = [];

  if (search) {
    pipeline.push({
      $match: { $text: { $search: search } },
    });
  }

  if (status) {
    pipeline.push({ $match: { status } });
  }

  if (affiliation) {
    pipeline.push({ $match: { affiliation } });
  }

  if (isEntity !== undefined) {
    pipeline.push({ $match: { isEntity } });
  }

  if (tagIds && tagIds.length > 0) {
    pipeline.push({
      $match: {
        "tags._id": { $in: tagIds.map((id: string) => new ObjectId(id)) },
      },
    });
  }

  if (nationality) {
    pipeline.push({
      $match: { nationality },
    });
  }

  if (createdAtFrom) {
    pipeline.push({
      $match: { createdAt: { $gte: createdAtFrom } },
    });
  }

  if (createdAtTo) {
    pipeline.push({
      $match: { createdAt: { $lte: createdAtTo } },
    });
  }

  if (search && (!sortBy || sortBy === "relevance")) {
    pipeline.push({
      $addFields: {
        textScore: { $meta: "textScore" },
      },
    });
  }

  const sortField = sortBy === "relevance" ? "textScore" : (sortBy || "_id");
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortField]: sortDirection } });

  const calculatedSkip = skip ?? limit * (page - 1);
  pipeline.push({ $skip: calculatedSkip });
  pipeline.push({ $limit: limit });

  return await warCriminal
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};
