import { array, boolean, enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { pagination } from "@lib";
import { language_array } from "@model";

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      // Text search
      search: optional(string()),
      // Filters
      isPublished: optional(boolean()),
      isFeatured: optional(boolean()),
      authorId: optional(objectIdValidation),
      tagIds: optional(array(objectIdValidation)),
      selected_language: optional(enums(language_array)),
      // Sort options
      sortBy: optional(enums(["publishedAt", "createdAt", "updatedAt", "title"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("blogPost", 2),
  });
};
