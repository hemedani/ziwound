import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      documentFileIds: optional(array(objectIdValidation)),
      documentFileIdsToRemove: optional(array(objectIdValidation)),
    }),
    get: selectStruct("document", 2),
  });
};
