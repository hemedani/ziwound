import { object, objectIdValidation } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const unpublishValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
    }),
    get: selectStruct("blogPost", 2),
  });
};
