import { array, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const updateRelationsValidator = () => {
  return object({
    set: object({
      _id: string(),
      tags: optional(array(string())),
      category: optional(string()),
    }),
    get: selectStruct("report", 2),
  });
};
