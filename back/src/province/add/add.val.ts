import { object, objectIdValidation } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { province_pure } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      ...province_pure,
      countryId: objectIdValidation,
    }),
    get: selectStruct("province", 1),
  });
};
