import {
  array,
  date,
  enums,
  number,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array, report_status_array } from "@model";

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
      country: optional(string()),
      city: optional(string()),
      status: optional(enums(report_status_array)),
      priority: optional(enums(["Low", "Medium", "High"])),
      selected_language: optional(enums(language_array)),
      crime_occurred_at: optional(date()),
      tags: optional(array(objectIdValidation)),
      category: optional(objectIdValidation),
    }),
    get: selectStruct("report", 2),
  });
};
