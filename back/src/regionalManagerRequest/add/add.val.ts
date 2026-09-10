import { enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { regional_manager_request_area_type_array } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      areaType: enums(regional_manager_request_area_type_array),
      countryId: optional(objectIdValidation),
      provinceId: optional(objectIdValidation),
      cityId: optional(objectIdValidation),
      justification: optional(string()),
    }),
    get: selectStruct("regionalManagerRequest", 2),
  });
};
