import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { document } from "../../../mod.ts";

export const getsFn: ActFn = async (body) => {
  const {
    set: {
      page,
      limit,
      skip,
      search,
      reportId,
      language,
      documentTypes,
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

  // Filter by report ID
  reportId &&
    pipeline.push({
      $match: { "report._id": new ObjectId(reportId as string) },
    });

  // Filter by language
  language &&
    pipeline.push({
      $match: { language },
    });

  // Filter by document file types
  documentTypes && documentTypes.length > 0 &&
    pipeline.push({
      $match: {
        "documentFiles.type": { $in: documentTypes },
      },
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

  return await document
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};
