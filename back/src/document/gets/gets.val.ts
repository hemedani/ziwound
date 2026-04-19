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

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      // Text search
      search: optional(string()),
      // Filters
      reportId: optional(objectIdValidation),
      documentTypes: optional(array(enums(["image", "video", "docs"]))),
      // Sort options
      sortBy: optional(enums(["createdAt", "updatedAt", "title"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("document", 2),
  });
};
