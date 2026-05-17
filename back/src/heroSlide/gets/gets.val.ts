import { enums, number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array } from "@model";

export const getsValidator = () => {
  return object({
    set: object({
      isActive: optional(string()), // Will be parsed to boolean
      selected_language: optional(enums(language_array)),
      page: optional(number()),
      limit: optional(number()),
      sortBy: optional(enums(["order", "createdAt", "updatedAt"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("heroSlide", 1),
  });
};
