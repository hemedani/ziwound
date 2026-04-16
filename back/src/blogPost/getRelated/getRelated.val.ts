import { object, string, optional, number } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const getRelatedValidator = () => {
  return object({
    set: object({
      slug: string(),
      limit: optional(number()),
    }),
    get: selectStruct("blogPost", 2),
  });
};
