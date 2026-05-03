import { array, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      tags: optional(array(objectIdValidation)),
      category: optional(objectIdValidation),
      documentIds: optional(array(objectIdValidation)),
      documentIdsToRemove: optional(array(objectIdValidation)),
      hostileCountryIds: optional(array(objectIdValidation)),
      hostileCountryIdsToRemove: optional(array(objectIdValidation)),
      attackedCountryIds: optional(array(objectIdValidation)),
      attackedCountryIdsToRemove: optional(array(objectIdValidation)),
      attackedProvinceIds: optional(array(objectIdValidation)),
      attackedProvinceIdsToRemove: optional(array(objectIdValidation)),
      attackedCityIds: optional(array(objectIdValidation)),
      attackedCityIdsToRemove: optional(array(objectIdValidation)),
    }),
    get: selectStruct("report", 2),
  });
};
