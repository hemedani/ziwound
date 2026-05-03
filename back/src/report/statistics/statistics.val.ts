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
import { language_array, report_status_array } from "@model";

export const statisticsValidator = () => {
  return object({
    set: object({
      status: optional(enums(report_status_array)),
      priority: optional(enums(["Low", "Medium", "High"])),
      selected_language: optional(enums(language_array)),
      categoryId: optional(objectIdValidation),
      country: optional(string()),
      city: optional(string()),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
      crimeOccurredFrom: optional(date()),
      crimeOccurredTo: optional(date()),
    }),
    get: selectStruct("report", 1),
  });
};
