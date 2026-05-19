import { boolean, enums, object, objectIdValidation, optional, string } from "lesan";
import { confirmation_type_array } from "@model";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
      type: optional(enums(confirmation_type_array)),
      isVerified: optional(boolean()),
      authorId: optional(objectIdValidation),
      reportId: optional(objectIdValidation),
    }),
    get: object({ qty: optional(string()) }),
  });
};
