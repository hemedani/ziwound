import {
  array,
  boolean,
  defaulted,
  object,
  objectIdValidation,
  optional,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import { city_pure } from "@model";

export const addManyValidator = () => {
  return object({
    set: object({
      items: array(
        object({
          ...city_pure,
          provinceId: objectIdValidation,
          countryId: objectIdValidation,
          // Optional caller-supplied id — see country/addMany for rationale.
          _id: optional(objectIdValidation),
        }),
      ),
      /**
       * When true (default, matching `city.add`) the reverse `cities` arrays on
       * the parent province/country are populated. Those arrays are capped at 50
       * entries by the model definition, so a full world import should pass
       * `false` — the data stays complete and queryable through `city.gets`.
       */
      linkRelated: optional(defaulted(boolean(), true)),
    }),
    get: selectStruct("city", 1),
  });
};
