import { array, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      documentFiles: optional(array(objectIdValidation)),
      removeDocumentFiles: optional(array(objectIdValidation)),
    }),
    get: selectStruct("document", 2),
  });
};
