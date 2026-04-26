import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const statisticsFn: ActFn = async (body) => {
  const { set: filters } = body.details;

  const matchStage: Document = {};

  if (filters.status) matchStage.status = filters.status;
  if (filters.priority) matchStage.priority = filters.priority;
  if (filters.language) matchStage.language = filters.language;
  if (filters.country) matchStage.country = filters.country;
  if (filters.city) matchStage.city = filters.city;
  if (filters.categoryId) matchStage["category._id"] = new ObjectId(filters.categoryId);
  if (filters.createdAtFrom || filters.createdAtTo) {
    matchStage.createdAt = {};
    if (filters.createdAtFrom) (matchStage.createdAt as Document).$gte = filters.createdAtFrom;
    if (filters.createdAtTo) (matchStage.createdAt as Document).$lte = filters.createdAtTo;
  }
  if (filters.crimeOccurredFrom || filters.crimeOccurredTo) {
    matchStage.crime_occurred_at = {};
    if (filters.crimeOccurredFrom) (matchStage.crime_occurred_at as Document).$gte = filters.crimeOccurredFrom;
    if (filters.crimeOccurredTo) (matchStage.crime_occurred_at as Document).$lte = filters.crimeOccurredTo;
  }

  const pipeline = [
    { $match: matchStage },
    {
      $facet: {
        total: [
          { $count: "count" }
        ],
        statusCounts: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        categoryCounts: [
          { $group: { _id: "$category.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        priorityCounts: [
          { $group: { _id: "$priority", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        languageCounts: [
          { $group: { _id: "$language", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        countryCounts: [
          { $group: { _id: "$country", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        cityCounts: [
          { $group: { _id: "$city", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        monthlyCounts: [
          { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ],
        crimeOccurredMonthlyCounts: [
          { $match: { crime_occurred_at: { $exists: true } } },
          { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$crime_occurred_at" } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ],
        geographicCounts: [
          { $match: { location: { $exists: true } } },
          { $group: { _id: { lng: { $round: [{ $arrayElemAt: ["$location.coordinates", 0] }, 1] }, lat: { $round: [{ $arrayElemAt: ["$location.coordinates", 1] }, 1] } }, count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]
      }
    }
  ];

  const result = await report.aggregation({ pipeline }).toArray();
  return result[0] || {};
};
