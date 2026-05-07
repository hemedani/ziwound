import { enums, number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const getsValidator = () => {
  return object({
    set: object({
      isActive: optional(string()), // Will be parsed to boolean
      page: optional(number()),
      limit: optional(number()),
      sortBy: optional(enums(["order", "createdAt", "updatedAt"])),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("heroSlide", 1),
  });
};
