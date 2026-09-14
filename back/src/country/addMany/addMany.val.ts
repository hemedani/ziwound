import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { country_pure } from "@model";

export const addManyValidator = () => {
  return object({
    set: object({
      items: array(
        object({
          ...country_pure,
          // Optional caller-supplied id. Lets a bulk importer generate
          // deterministic ObjectIds so the import is idempotent / resumable.
          _id: optional(objectIdValidation),
        }),
      ),
    }),
    get: selectStruct("country", 1),
  });
};
