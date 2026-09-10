import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { warCriminal_pure } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      ...warCriminal_pure,
      tagIds: optional(array(objectIdValidation)),
      photoId: optional(objectIdValidation),
      birthCountryId: optional(objectIdValidation),
      birthCityId: optional(objectIdValidation),
      residenceCountryId: optional(objectIdValidation),
      residenceCityId: optional(objectIdValidation),
    }),
    get: selectStruct("warCriminal", 1),
  });
};
