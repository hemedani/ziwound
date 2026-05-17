import { enums, object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array } from "@model";

export const countValidator = () => {
  return object({
    set: object({
      isActive: optional(string()), // Will be parsed to boolean
      selected_language: optional(enums(language_array)),
    }),
    get: selectStruct("heroSlide", 1),
  });
};
