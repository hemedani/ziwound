import { array, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { document_pure } from "@model";

export const addValidator = () => {
  const { ...basePure } = document_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      documentFiles: optional(array(string())),
    }),
    get: selectStruct("document", 1),
  });
};
