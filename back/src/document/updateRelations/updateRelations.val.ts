import { array, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: string(),
      documentFiles: optional(array(string())),
      removeDocumentFiles: optional(array(string())),
      report: optional(string()),
    }),
    get: selectStruct("document", 2),
  });
};
