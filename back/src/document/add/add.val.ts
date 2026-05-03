import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { document_pure } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      ...document_pure,
      documentFileIds: optional(array(objectIdValidation)),
    }),
    get: selectStruct("document", 1),
  });
};
