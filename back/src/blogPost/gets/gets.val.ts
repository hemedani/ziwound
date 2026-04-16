import { array, enums, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { pagination } from "@lib";

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      // Text search
      search: optional(string()),
      // Filters
      isPublished: optional(enums([true, false])),
      authorId: optional(objectIdValidation),
      tagIds: optional(array(objectIdValidation)),
      // Sort options
      sortBy: optional(enums(["publishedAt", "createdAt", "updatedAt", "title"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("blogPost", 2),
  });
};