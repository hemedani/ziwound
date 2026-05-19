import {
  boolean,
  date,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { confirmation_type_array, language_array } from "@model";
import { pagination } from "@lib";

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      search: optional(string()),
      type: optional(enums(confirmation_type_array)),
      isVerified: optional(boolean()),
      authorId: optional(objectIdValidation),
      reportId: optional(objectIdValidation),
      selected_language: optional(enums(language_array)),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
      sortBy: optional(
        enums([
          "createdAt",
          "updatedAt",
          "title",
          "type",
        ]),
      ),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("confirmation", 2),
  });
};
