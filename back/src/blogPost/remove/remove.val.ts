import { boolean, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const removeValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      hardCascade: optional(boolean()),
    }),
    get: selectStruct("blogPost", 1),
  });
};