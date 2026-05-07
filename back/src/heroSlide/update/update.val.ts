import { object, objectIdValidation } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { heroSlide_pure } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      ...heroSlide_pure,
    }),
    get: selectStruct("heroSlide", 1),
  });
};
