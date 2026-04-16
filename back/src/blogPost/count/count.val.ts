import { array, enums, object, objectIdValidation, optional, string } from "@deps";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
      isPublished: optional(enums([true, false])),
      authorId: optional(objectIdValidation),
      tagIds: optional(array(objectIdValidation)),
    }),
    get: object({
      qty: optional(string()),
    }),
  });
};