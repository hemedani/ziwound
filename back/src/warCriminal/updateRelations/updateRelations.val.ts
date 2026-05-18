import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      tagIds: optional(array(objectIdValidation)),
      tagIdsToRemove: optional(array(objectIdValidation)),
      photoId: optional(objectIdValidation),
    }),
    get: selectStruct("warCriminal", 2),
  });
};
