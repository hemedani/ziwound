import { array, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { blogPost_pure } from "@model";

export const addValidator = () => {
  const { ...basePure } = blogPost_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      coverImage: optional(objectIdValidation),
      tags: optional(array(objectIdValidation)),
    }),
    get: selectStruct("blogPost", 1),
  });
};
