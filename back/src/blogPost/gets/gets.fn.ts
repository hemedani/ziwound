import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      isPublished,
      authorId,
      tagIds,
      sortBy,
      sortOrder,
    },
    get,
  } = body.details;

  const pipeline: any[] = [];

  // Text search using MongoDB text index
  if (search) {
    pipeline.push({
      $match: { $text: { $search: search } },
    });
  }

  // isPublished filter
  if (isPublished !== undefined) {
    pipeline.push({
      $match: { isPublished },
    });
  }

  // Author filter
  if (authorId) {
    pipeline.push({
      $match: { "author._id": new ObjectId(authorId) },
    });
  }

  // Tags filter
  if (tagIds && tagIds.length > 0) {
    pipeline.push({
      $match: {
        "tags._id": { $in: tagIds.map((id: string) => new ObjectId(id)) },
      },
    });
  }

  // Add text search score for sorting if search term exists
  if (search && (!sortBy || sortBy === "relevance")) {
    pipeline.push({
      $addFields: {
        textScore: { $meta: "textScore" },
      },
    });
  }

  // Sorting
  const sortField =
    sortBy === "relevance"
      ? "textScore"
      : sortBy || "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortField]: sortDirection } });

  // Pagination
  const calculatedSkip = skip ?? limit * (page - 1);
  pipeline.push({ $skip: calculatedSkip });
  pipeline.push({ $limit: limit });

  return await blogPost
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};