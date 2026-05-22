import type { ActFn } from "lesan";
import {
  blogPost,
  category,
  city,
  country,
  document,
  file,
  heroSlide,
  province,
  report,
  tag,
  user,
  warCriminal,
} from "../../../mod.ts";

export const dashboardStatisticFn: ActFn = async (body) => {
  const { get } = body.details;
  const result: Record<string, unknown> = {};

  const tasks: Promise<void>[] = [];

  const simpleCounts: [string, any][] = [
    ["categories", category],
    ["cities", city],
    ["provinces", province],
    ["tags", tag],
    ["users", user],
    ["reports", report],
    ["documents", document],
    ["blogPosts", blogPost],
    ["heroSlides", heroSlide],
    ["countries", country],
    ["files", file],
    ["warCriminals", warCriminal],
  ];

  for (const [key, model] of simpleCounts) {
    if (get[key] === 1) {
      tasks.push(
        model.countDocument({}).then((v: number) => {
          result[key] = v;
        }),
      );
    }
  }

  if (
    get.userByLevel === 1 || get.userByVerification === 1
  ) {
    const userFacet: Record<string, unknown[]> = {};
    if (get.userByLevel === 1) {
      userFacet.byLevel = [
        { $match: { level: { $ne: "Ghost" } } },
        { $group: { _id: "$level", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];
    }
    if (get.userByVerification === 1) {
      userFacet.byVerified = [
        { $group: { _id: "$verified", count: { $sum: 1 } } },
      ];
    }
    tasks.push(
      user.aggregation({
        pipeline: [{ $facet: userFacet }],
      }).toArray().then((arr) => {
        const facet = arr[0] || {};
        if (facet.byLevel) result.userByLevel = facet.byLevel;
        if (facet.byVerified) result.userByVerification = facet.byVerified;
      }),
    );
  }

  if (
    get.reportByStatus === 1 || get.reportByPriority === 1 ||
    get.reportByLanguage === 1 || get.reportsLastWeek === 1 ||
    get.reportsLastMonth === 1
  ) {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const reportFacet: Record<string, unknown[]> = {};
    if (get.reportByStatus === 1) {
      reportFacet.byStatus = [
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];
    }
    if (get.reportByPriority === 1) {
      reportFacet.byPriority = [
        { $group: { _id: "$priority", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];
    }
    if (get.reportByLanguage === 1) {
      reportFacet.byLanguage = [
        { $group: { _id: "$selected_language", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];
    }
    if (get.reportsLastWeek === 1) {
      reportFacet.lastWeek = [
        { $match: { createdAt: { $gte: lastWeek } } },
        { $count: "count" },
      ];
    }
    if (get.reportsLastMonth === 1) {
      reportFacet.lastMonth = [
        { $match: { createdAt: { $gte: lastMonth } } },
        { $count: "count" },
      ];
    }
    tasks.push(
      report.aggregation({
        pipeline: [{ $facet: reportFacet }],
      }).toArray().then((arr) => {
        const facet = arr[0] || {};
        if (facet.byStatus) result.reportByStatus = facet.byStatus;
        if (facet.byPriority) result.reportByPriority = facet.byPriority;
        if (facet.byLanguage) result.reportByLanguage = facet.byLanguage;
        if (facet.lastWeek) {
          result.reportsLastWeek = facet.lastWeek[0]?.count || 0;
        }
        if (facet.lastMonth) {
          result.reportsLastMonth = facet.lastMonth[0]?.count || 0;
        }
      }),
    );
  }

  if (get.blogPostByStatus === 1) {
    tasks.push(
      blogPost.aggregation({
        pipeline: [
          { $group: { _id: "$isPublished", count: { $sum: 1 } } },
        ],
      }).toArray().then((arr) => {
        result.blogPostByStatus = arr;
      }),
    );
  }

  if (get.heroSlideByStatus === 1) {
    tasks.push(
      heroSlide.aggregation({
        pipeline: [
          { $group: { _id: "$isActive", count: { $sum: 1 } } },
        ],
      }).toArray().then((arr) => {
        result.heroSlideByStatus = arr;
      }),
    );
  }

  if (get.fileByType === 1) {
    tasks.push(
      file.aggregation({
        pipeline: [
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
              totalSize: { $sum: "$size" },
            },
          },
          { $sort: { count: -1 } },
        ],
      }).toArray().then((arr) => {
        result.fileByType = arr;
      }),
    );
  }

  if (get.warCriminalByStatus === 1 || get.warCriminalByAffiliation === 1) {
    const wcFacet: Record<string, unknown[]> = {};
    if (get.warCriminalByStatus === 1) {
      wcFacet.byStatus = [
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];
    }
    if (get.warCriminalByAffiliation === 1) {
      wcFacet.byAffiliation = [
        { $group: { _id: "$affiliation", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];
    }
    tasks.push(
      warCriminal.aggregation({
        pipeline: [{ $facet: wcFacet }],
      }).toArray().then((arr) => {
        const facet = arr[0] || {};
        if (facet.byStatus) result.warCriminalByStatus = facet.byStatus;
        if (facet.byAffiliation) {
          result.warCriminalByAffiliation = facet.byAffiliation;
        }
      }),
    );
  }

  await Promise.all(tasks);
  return result;
};
