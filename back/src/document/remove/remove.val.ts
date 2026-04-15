import { boolean, object, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";

export const removeValidator = () => {
  return object({
    set: object({
      _id: string(),
      hardCascade: optional(boolean()),
    }),
    get: selectStruct("document", 1),
  });
};
