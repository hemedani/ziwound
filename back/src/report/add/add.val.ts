import { array, number, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { report_pure } from "@model";

export const addValidator = () => {
  const { location, address, status, priority, language, ...basePure } =
    report_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      language: language,
      location: optional(
        object({
          type: string(),
          coordinates: array(number()),
        }),
      ),
      tags: optional(array(objectIdValidation)),
      category: optional(objectIdValidation),
      documentIds: optional(array(objectIdValidation)),
    }),
    get: selectStruct("report", 1),
  });
};
