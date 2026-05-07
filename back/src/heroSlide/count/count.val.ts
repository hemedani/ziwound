import { object, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const countValidator = () => {
  return object({
    set: object({
      isActive: optional(string()), // Will be parsed to boolean
    }),
    get: selectStruct("heroSlide", 1),
  });
};
