import { type ActFn, ObjectId } from "lesan";
import { report } from "../../../mod.ts";

function arrayToCSV(data: any[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const csvRows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      if (Array.isArray(value)) {
        return `"${value.join(", ")}"`;
      }
      return typeof value === "string" && value.includes(",")
        ? `"${value}"`
        : value;
    }).join(",")
  );
  return [headers.join(","), ...csvRows].join("\n");
}

export const exportCSVFn: ActFn = async (body) => {
  const {
    set: {
      search,
      status,
      priority,
      selected_language,
      categoryIds,
      tagIds,
      userIds,
      hostileCountryIds,
      attackedCountryIds,
      attackedProvinceIds,
      attackedCityIds,
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
      limit = 1000,
    },
    get,
  } = body.details;

  const pipeline: any[] = [];

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

  // Hostile Countries filter (attackers)
  hostileCountryIds && hostileCountryIds.length > 0 &&
    pipeline.push({
      $match: {
        "hostileCountries._id": {
          $in: hostileCountryIds.map((id: string) => new ObjectId(id)),
        },
      },
    });

  // Attacked Countries filter (victims)
  attackedCountryIds && attackedCountryIds.length > 0 &&
    pipeline.push({
      $match: {
        "attackedCountries._id": {
          $in: attackedCountryIds.map((id: string) => new ObjectId(id)),
        },
      },
    });

  // Attacked Provinces filter
  attackedProvinceIds && attackedProvinceIds.length > 0 &&
    pipeline.push({
      $match: {
        "attackedProvinces._id": {
          $in: attackedProvinceIds.map((id: string) => new ObjectId(id)),
        },
      },
    });

  // Attacked Cities filter
  attackedCityIds && attackedCityIds.length > 0 &&
    pipeline.push({
      $match: {
        "attackedCities._id": {
          $in: attackedCityIds.map((id: string) => new ObjectId(id)),
        },
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
      $centerSphere: [[nearLng, nearLat], (maxDistance || 10000) / 6378100], // default 10km
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

  // Limit for export
  pipeline.push({ $limit: limit });

  const data = await report
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();

  const csv = arrayToCSV(data);
  return csv;
};
