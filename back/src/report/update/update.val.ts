import {
  date,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array, report_status_array } from "@model";
import { geoJSONStruct } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      title: optional(string()),
      description: optional(string()),
      location: optional(geoJSONStruct("Point")),
      address: optional(string()),
      status: optional(enums(report_status_array)),
      priority: optional(enums(["Low", "Medium", "High"])),
      selected_language: optional(enums(language_array)),
      crime_occurred_at: optional(date()),
    }),
    get: selectStruct("report", 2),
  });
};
