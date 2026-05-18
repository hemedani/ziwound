import {
  array,
  boolean,
  date,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import {
  warCriminal_affiliation_array,
  warCriminal_status_array,
} from "@model";
import { pagination } from "@lib";

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      search: optional(string()),
      status: optional(enums(warCriminal_status_array)),
      affiliation: optional(enums(warCriminal_affiliation_array)),
      isEntity: optional(boolean()),
      tagIds: optional(array(objectIdValidation)),
      nationality: optional(string()),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
      sortBy: optional(
        enums([
          "createdAt",
          "updatedAt",
          "fullName",
          "status",
          "affiliation",
        ]),
      ),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("warCriminal", 2),
  });
};
