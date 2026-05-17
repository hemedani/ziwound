import { boolean, enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      title: optional(string()),
      slug: optional(string()),
      content: optional(string()),
      selected_language: optional(enums(language_array)),
      isPublished: optional(boolean()),
      isFeatured: optional(boolean()),
      publishedAt: optional(string()),
    }),
    get: selectStruct("blogPost", 2),
  });
};
