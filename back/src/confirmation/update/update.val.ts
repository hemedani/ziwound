import { boolean, enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { confirmation_type_array, language_array } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      title: optional(string()),
      content: optional(string()),
      type: optional(enums(confirmation_type_array)),
      isVerified: optional(boolean()),
      selected_language: optional(enums(language_array)),
    }),
    get: selectStruct("confirmation", 2),
  });
};
