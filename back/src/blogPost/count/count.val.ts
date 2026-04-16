import { array, boolean, enums, object, objectIdValidation, optional, string } from "@deps";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
      isPublished: optional(boolean()),
      authorId: optional(objectIdValidation),
      tagIds: optional(array(objectIdValidation)),
    }),
    get: object({
      qty: optional(string()),
    }),
  });
};
