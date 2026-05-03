import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
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
      selected_language,
      categoryIds,
      tagIds,
      userIds,
      country,
      city,
      createdAtFrom,
      createdAtTo,
      crimeOccurredFrom,
      crimeOccurredTo,
      nearLng,
      nearLat,
      maxDistance,
      bbox,
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

  // Language filter
  selected_language &&
    pipeline.push({
      $match: { selected_language },
    });

  // Country filter
  country &&
    pipeline.push({
      $match: { country },
    });

  // City filter
  city &&
    pipeline.push({
      $match: { city },
    });

  // Category filter (array of IDs)
  categoryIds && categoryIds.length > 0 &&
    pipeline.push({
      $match: {
        "category._id": {
          $in: categoryIds.map((id: string) => new ObjectId(id)),
        },
      },
    });

  // Tag filter (array of IDs)
  tagIds && tagIds.length > 0 &&
    pipeline.push({
      $match: {
        "tags._id": { $in: tagIds.map((id: string) => new ObjectId(id)) },
      },
    });

  // User/Reporter filter (array of IDs)
  userIds && userIds.length > 0 &&
    pipeline.push({
      $match: {
        "reporter._id": { $in: userIds.map((id: string) => new ObjectId(id)) },
      },
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

  // Crime occurred date range filters
  crimeOccurredFrom &&
    pipeline.push({
      $match: { crime_occurred_at: { $gte: crimeOccurredFrom } },
    });

  crimeOccurredTo &&
    pipeline.push({
      $match: { crime_occurred_at: { $lte: crimeOccurredTo } },
    });

  // Geospatial filters
  if (bbox && bbox.length === 4) {
    pipeline.push({
      $match: {
        location: {
          $geoWithin: {
            $box: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
          },
        },
      },
    });
  }

  if (nearLng !== undefined && nearLat !== undefined) {
    const centerSphere: any = {
      $centerSphere: [[nearLng, nearLat], (maxDistance || 10000) / 6378100], // default 10km, earth radius in meters
    };
    pipeline.push({
      $match: {
        location: {
          $geoWithin: centerSphere,
        },
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
      projection: { ...get, documents: 1 },
    })
    .toArray();
};
