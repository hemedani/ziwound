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
    }),
  });
};
