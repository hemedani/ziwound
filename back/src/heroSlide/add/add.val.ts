import { object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { heroSlide_pure } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      ...heroSlide_pure,
      image: optional(objectIdValidation), // File ID
    }),
    get: selectStruct("heroSlide", 1),
  });
};
