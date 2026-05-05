import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { report_pure } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      ...report_pure,
      tags: optional(array(objectIdValidation)),
      category: optional(objectIdValidation),
      documentIds: optional(array(objectIdValidation)),
      hostileCountryIds: optional(array(objectIdValidation)),
      attackedCountryIds: optional(array(objectIdValidation)),
      attackedProvinceIds: optional(array(objectIdValidation)),
      attackedCityIds: optional(array(objectIdValidation)),
    }),
    get: selectStruct("report", 1),
  });
};
