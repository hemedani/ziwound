import { array, date, enums, object, objectIdValidation, optional } from "lesan";
import { language_array, report_status_array } from "@model";

export const countValidator = () => {
  return object({
    set: object({
      status: optional(enums(report_status_array)),
      priority: optional(enums(["Low", "Medium", "High"])),
      selected_language: optional(enums(language_array)),
      categoryId: optional(objectIdValidation),
      hostileCountryIds: optional(array(objectIdValidation)),
      attackedCountryIds: optional(array(objectIdValidation)),
      attackedProvinceIds: optional(array(objectIdValidation)),
      attackedCityIds: optional(array(objectIdValidation)),
      createdAtFrom: optional(date()),
      createdAtTo: optional(date()),
    }),
    get: object({ qty: optional(enums([0, 1])) }),
  });
};
