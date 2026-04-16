import { array, enums, number, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { report_status_array } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      title: optional(string()),
      description: optional(string()),
      location: optional(
        object({
          type: optional(string()),
          coordinates: optional(array(number())),
        }),
      ),
      address: optional(string()),
      status: optional(enums(report_status_array)),
      priority: optional(enums(["Low", "Medium", "High"])),
      tags: optional(array(objectIdValidation)),
      category: optional(objectIdValidation),
    }),
    get: selectStruct("report", 2),
  });
};
