import { enums, number, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array } from "@model";

export const getRelatedValidator = () => {
  return object({
    set: object({
      slug: string(),
      limit: optional(number()),
      selected_language: optional(enums(language_array)),
    }),
    get: selectStruct("blogPost", 2),
  });
};
