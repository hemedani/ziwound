import { boolean, enums, object, objectIdValidation, optional, string } from "@deps";

export const removeValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      hardCascade: optional(boolean()),
    }),
    get: object({
      success: optional(enums([0, 1])),
    }),
  });
};
