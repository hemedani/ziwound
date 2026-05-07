import { object, objectIdValidation } from "lesan";

export const removeValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
    }),
  });
};
