import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { confirmation } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      type,
      isVerified,
      authorId,
      reportId,
      selected_language,
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

  if (type) {
    pipeline.push({ $match: { type } });
  }

  if (isVerified !== undefined) {
    pipeline.push({ $match: { isVerified } });
  }

  if (authorId) {
    pipeline.push({
      $match: { "author._id": new ObjectId(authorId) },
    });
  }

  if (reportId) {
    pipeline.push({
      $match: { "report._id": new ObjectId(reportId) },
    });
  }

  if (selected_language) {
    pipeline.push({ $match: { selected_language } });
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

  return await confirmation
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};
