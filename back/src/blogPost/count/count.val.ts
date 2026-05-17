import { array, boolean, enums, object, objectIdValidation, optional, string } from "lesan";
import { language_array } from "@model";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
      isPublished: optional(boolean()),
      authorId: optional(objectIdValidation),
      tagIds: optional(array(objectIdValidation)),
      selected_language: optional(enums(language_array)),
    }),
    get: object({
      qty: optional(string()),
    }),
  });
};
