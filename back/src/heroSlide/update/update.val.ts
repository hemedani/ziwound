import { object, objectIdValidation, optional } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { heroSlide_pure } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      ...heroSlide_pure,
      image: optional(objectIdValidation),
    }),
    get: selectStruct("heroSlide", 1),
  });
};
