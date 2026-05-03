import {
  array,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
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
      reportId: optional(objectIdValidation),
      selected_language: optional(enums(language_array)),
      documentTypes: optional(array(enums(["image", "video", "docs"]))),
      // Sort options
      sortBy: optional(enums(["createdAt", "updatedAt", "title"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("document", 2),
  });
};
