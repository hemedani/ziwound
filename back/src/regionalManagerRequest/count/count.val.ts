import {
  array,
  date,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import {
  regional_manager_request_area_type_array,
  regional_manager_request_status_array,
} from "@model";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
      status: optional(enums(regional_manager_request_status_array)),
      areaType: optional(enums(regional_manager_request_area_type_array)),
      userIds: optional(array(objectIdValidation)),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
    }),
    get: object({ qty: optional(enums([0, 1])) }),
  });
};
