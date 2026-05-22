import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const statisticsFn: ActFn = async (body) => {
  const { set: filters } = body.details;

  const matchStage: Document = {};

  if (filters.status) matchStage.status = filters.status;
  if (filters.priority) matchStage.priority = filters.priority;
  if (filters.selected_language) {
    matchStage.selected_language = filters.selected_language;
  }
  if (filters.categoryId) {
    matchStage["category._id"] = new ObjectId(filters.categoryId);
  }

  if (filters.hostileCountryIds && filters.hostileCountryIds.length > 0) {
    matchStage["hostileCountries._id"] = {
      $in: filters.hostileCountryIds.map((id: string) => new ObjectId(id)),
    };
  }
  if (filters.attackedCountryIds && filters.attackedCountryIds.length > 0) {
    matchStage["attackedCountries._id"] = {
      $in: filters.attackedCountryIds.map((id: string) => new ObjectId(id)),
    };
  }
  if (filters.attackedProvinceIds && filters.attackedProvinceIds.length > 0) {
    matchStage["attackedProvinces._id"] = {
      $in: filters.attackedProvinceIds.map((id: string) => new ObjectId(id)),
    };
  }
  if (filters.attackedCityIds && filters.attackedCityIds.length > 0) {
    matchStage["attackedCities._id"] = {
      $in: filters.attackedCityIds.map((id: string) => new ObjectId(id)),
    };
  }

  if (filters.tagIds && filters.tagIds.length > 0) {
    matchStage["tags._id"] = {
      $in: filters.tagIds.map((id: string) => new ObjectId(id)),
    };
  }
  if (filters.warCriminalIds && filters.warCriminalIds.length > 0) {
    matchStage["warCriminals._id"] = {
      $in: filters.warCriminalIds.map((id: string) => new ObjectId(id)),
    };
  }
  if (filters.userIds && filters.userIds.length > 0) {
    matchStage["reporter._id"] = {
      $in: filters.userIds.map((id: string) => new ObjectId(id)),
    };
  }

  if (filters.createdAtFrom || filters.createdAtTo) {
    matchStage.createdAt = {};
    if (filters.createdAtFrom) {
      (matchStage.createdAt as Document).$gte = filters.createdAtFrom;
    }
    if (filters.createdAtTo) {
      (matchStage.createdAt as Document).$lte = filters.createdAtTo;
    }
  }
  if (filters.crimeOccurredFrom || filters.crimeOccurredTo) {
    matchStage.crime_occurred_at = {};
    if (filters.crimeOccurredFrom) {
      (matchStage.crime_occurred_at as Document).$gte =
        filters.crimeOccurredFrom;
    }
    if (filters.crimeOccurredTo) {
      (matchStage.crime_occurred_at as Document).$lte = filters.crimeOccurredTo;
    }
  }

  const pipeline = [
    { $match: matchStage },
    {
      $facet: {
        total: [
          { $count: "count" },
        ],
        statusCounts: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        categoryCounts: [
          { $group: { _id: "$category.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        priorityCounts: [
          { $group: { _id: "$priority", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        languageCounts: [
          { $group: { _id: "$selected_language", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        hostileCountryCounts: [
          { $unwind: "$hostileCountries" },
          { $group: { _id: "$hostileCountries.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        attackedCountryCounts: [
          { $unwind: "$attackedCountries" },
          { $group: { _id: "$attackedCountries.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        attackedProvinceCounts: [
          { $unwind: "$attackedProvinces" },
          { $group: { _id: "$attackedProvinces.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        attackedCityCounts: [
          { $unwind: "$attackedCities" },
          { $group: { _id: "$attackedCities.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        tagCounts: [
          { $unwind: "$tags" },
          { $group: { _id: "$tags.name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 50 },
        ],
        warCriminalCounts: [
          { $unwind: "$warCriminals" },
          {
            $group: {
              _id: "$warCriminals.fullName",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 50 },
        ],
        reporterCounts: [
          { $match: { "reporter.level": { $ne: "Ghost" } } },
          {
            $group: {
              _id: "$reporter._id",
              firstName: { $first: "$reporter.first_name" },
              lastName: { $first: "$reporter.last_name" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ],
        monthlyCounts: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
        weeklyCounts: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-W%V", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
        dailyCounts: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
        crimeOccurredMonthlyCounts: [
          { $match: { crime_occurred_at: { $exists: true } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$crime_occurred_at" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
        geographicCounts: [
          { $match: { location: { $exists: true } } },
          {
            $group: {
              _id: {
                lng: {
                  $round: [{ $arrayElemAt: ["$location.coordinates", 0] }, 1],
                },
                lat: {
                  $round: [{ $arrayElemAt: ["$location.coordinates", 1] }, 1],
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ];

  const result = await report.aggregation({ pipeline }).toArray();
  return result[0] || {};
};
