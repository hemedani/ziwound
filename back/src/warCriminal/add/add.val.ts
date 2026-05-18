import { array, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { warCriminal_pure } from "@model";

export const addValidator = () => {
  return object({
    set: object({
      ...warCriminal_pure,
      tagIds: optional(array(objectIdValidation)),
      photoId: optional(objectIdValidation),
    }),
    get: selectStruct("warCriminal", 1),
  });
};
