import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      authorId: optional(objectIdValidation),
      reportId: optional(objectIdValidation),
      supportingFileIds: optional(array(objectIdValidation)),
      supportingFileIdsToRemove: optional(array(objectIdValidation)),
    }),
    get: selectStruct("confirmation", 2),
  });
};
