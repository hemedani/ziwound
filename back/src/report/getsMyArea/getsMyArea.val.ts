import { enums, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { report_status_array } from "@model";
import { pagination } from "@lib";

export const getsMyAreaValidator = () => {
  return object({
    set: object({
      ...pagination,
      status: optional(enums(report_status_array)),
      search: optional(string()),
      sortBy: optional(
        enums(["createdAt", "updatedAt", "title", "status", "priority"]),
      ),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("report", 2),
  });
};
