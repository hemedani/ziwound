import { array, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      tags: optional(array(objectIdValidation)),
      category: optional(objectIdValidation),
      documents: optional(array(objectIdValidation)),
      removeDocuments: optional(array(objectIdValidation)),
    }),
    get: selectStruct("report", 2),
  });
};
