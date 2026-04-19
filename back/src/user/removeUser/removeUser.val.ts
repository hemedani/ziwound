import { boolean, enums, object, objectIdValidation, optional } from "lesan";

export const removeUserValidator = () => {
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
