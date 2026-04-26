import { array, object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { document_pure } from "@model";

export const addValidator = () => {
  const { language, ...basePure } = document_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      language: language as any,
      documentFileIds: optional(array(objectIdValidation)),
    }),
    get: selectStruct("document", 1),
  });
};
