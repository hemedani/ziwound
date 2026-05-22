import { enums, object, optional } from "lesan";

export const dashboardStatisticValidator = () => {
  return object({
    set: object({}),
    get: object({
      users: optional(enums([0, 1])),
      provinces: optional(enums([0, 1])),
      cities: optional(enums([0, 1])),
      categories: optional(enums([0, 1])),
      tags: optional(enums([0, 1])),
      reports: optional(enums([0, 1])),
      documents: optional(enums([0, 1])),
      blogPosts: optional(enums([0, 1])),
      heroSlides: optional(enums([0, 1])),
      countries: optional(enums([0, 1])),
      files: optional(enums([0, 1])),
      warCriminals: optional(enums([0, 1])),
      userByLevel: optional(enums([0, 1])),
      userByVerification: optional(enums([0, 1])),
      reportByStatus: optional(enums([0, 1])),
      reportByPriority: optional(enums([0, 1])),
      reportByLanguage: optional(enums([0, 1])),
      blogPostByStatus: optional(enums([0, 1])),
      heroSlideByStatus: optional(enums([0, 1])),
      fileByType: optional(enums([0, 1])),
      warCriminalByStatus: optional(enums([0, 1])),
      warCriminalByAffiliation: optional(enums([0, 1])),
      reportsLastWeek: optional(enums([0, 1])),
      reportsLastMonth: optional(enums([0, 1])),
    }),
  });
};
