import { array, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { blogPost_pure } from "@model";

export const addValidator = () => {
  const { ...basePure } = blogPost_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      coverImage: optional(string()),
      tags: optional(array(string())),
    }),
    get: selectStruct("blogPost", 1),
  });
};
