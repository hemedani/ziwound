import { type ActFn, ObjectId } from "@deps";
import { report } from "../../../mod.ts";

function arrayToCSV(data: any[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (Array.isArray(value)) {
        return `"${value.join(', ')}"`;
      }
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );
  return [headers.join(','), ...csvRows].join('\n');
}

export const exportCSVFn: ActFn = async (body) => {
  const {
    set: {
      search,
      status,
      priority,
      categoryIds,
      tagIds,
      userIds,
      createdAtFrom,
      createdAtTo,
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

  // Geospatial filters
  if (bbox && bbox.length === 4) {
    pipeline.push({
      $match: {
        location: {
          $geoWithin: {
            $box: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]]
          }
        }
      }
    });
  }

  if (nearLng !== undefined && nearLat !== undefined) {
    const centerSphere: any = {
      $centerSphere: [[nearLng, nearLat], (maxDistance || 10000) / 6378100]  // default 10km
    };
    pipeline.push({
      $match: {
        location: {
          $geoWithin: centerSphere
        }
      }
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
