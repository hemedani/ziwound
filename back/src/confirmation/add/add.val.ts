import { array, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { confirmation_pure } from "@model";

export const addValidator = () => {
  const { badge, ...basePure } = confirmation_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      reportId: objectIdValidation,
      supportingFileIds: optional(array(objectIdValidation)),
    }),
    get: selectStruct("confirmation", 1),
  });
};
