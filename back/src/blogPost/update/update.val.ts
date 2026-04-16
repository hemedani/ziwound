import { boolean, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      title: optional(string()),
      slug: optional(string()),
      content: optional(string()),
      isPublished: optional(boolean()),
      isFeatured: optional(boolean()),
      publishedAt: optional(string()),
    }),
    get: selectStruct("blogPost", 2),
  });
};
