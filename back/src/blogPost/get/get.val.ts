import { object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const getValidator = () => {
  return object({
    set: object({
      _id: optional(objectIdValidation),
      slug: optional(string()),
    }),
    get: selectStruct("blogPost", 2),
  });
};