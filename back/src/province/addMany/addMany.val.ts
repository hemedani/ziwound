import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { province_pure } from "@model";

export const addManyValidator = () => {
  return object({
    set: object({
      items: array(
        object({
          ...province_pure,
          countryId: objectIdValidation,
          // Optional caller-supplied id — see country/addMany for rationale.
          _id: optional(objectIdValidation),
        }),
      ),
    }),
    get: selectStruct("province", 1),
  });
};
