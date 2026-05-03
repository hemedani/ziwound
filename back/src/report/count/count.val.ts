import { array, date, enums, object, optional, string } from "lesan";
import { language_array, report_status_array } from "@model";

export const countValidator = () => {
  return object({
    set: object({
      status: optional(enums(report_status_array)),
      priority: optional(enums(["Low", "Medium", "High"])),
      selected_language: optional(enums(language_array)),
      categoryId: optional(string()),
      country: optional(string()),
      city: optional(string()),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
    }),
    get: object({ qty: optional(enums([0, 1])) }),
  });
};
