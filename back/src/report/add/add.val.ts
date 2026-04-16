import { array, number, object, objectIdValidation, optional, string } from "@deps";
import { selectStruct } from "../../../mod.ts";
import { report_pure } from "@model";

export const addValidator = () => {
  const { location, address, status, priority, ...basePure } =
    report_pure as Record<string, unknown>;

  return object({
    set: object({
      ...basePure,
      location: optional(
        object({
          type: string(),
          coordinates: array(number()),
        }),
      ),
      tags: optional(array(string())),
      category: optional(string()),
      documents: optional(array(objectIdValidation)),
    }),
    get: selectStruct("report", 1),
  });
};
