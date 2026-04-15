import { object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const updateValidator = () => {
  return object({
    set: object({
      _id: string(),
      title: optional(string()),
      description: optional(string()),
    }),
    get: selectStruct("document", 2),
  });
};
