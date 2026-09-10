import {
  array,
  date,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import {
  regional_manager_request_area_type_array,
  regional_manager_request_status_array,
} from "@model";
import { pagination } from "@lib";

export const getsValidator = () => {
  return object({
    set: object({
      ...pagination,
      search: optional(string()),
      status: optional(enums(regional_manager_request_status_array)),
      areaType: optional(enums(regional_manager_request_area_type_array)),
      userIds: optional(array(objectIdValidation)),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
      sortBy: optional(
        enums(["createdAt", "updatedAt", "status", "areaType"]),
      ),
      sortOrder: optional(enums(["asc", "desc"])),
    }),
    get: selectStruct("regionalManagerRequest", 2),
  });
};
