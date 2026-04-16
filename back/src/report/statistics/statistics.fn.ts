import { type ActFn } from "@deps";
import { report } from "../../../mod.ts";

export const statisticsFn: ActFn = async (body) => {
  const pipeline = [
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
        monthlyCounts: [
          { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
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
