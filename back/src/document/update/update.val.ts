import { enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { language_array } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      title: optional(string()),
      description: optional(string()),
      language: optional(enums(language_array)),
    }),
    get: selectStruct("document", 2),
  });
};
