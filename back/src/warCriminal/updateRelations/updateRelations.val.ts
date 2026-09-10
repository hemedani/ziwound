import { array, boolean, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      tagIds: optional(array(objectIdValidation)),
      tagIdsToRemove: optional(array(objectIdValidation)),
      photoId: optional(objectIdValidation),
      birthCountryId: optional(objectIdValidation),
      birthCityId: optional(objectIdValidation),
      removeBirth: optional(boolean()),
      residenceCountryId: optional(objectIdValidation),
      residenceCityId: optional(objectIdValidation),
      removeResidence: optional(boolean()),
    }),
    get: selectStruct("warCriminal", 2),
  });
};
