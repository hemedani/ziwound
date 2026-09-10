import { enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";
import { report_status_array } from "@model";

export const updateStatusValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      status: enums(report_status_array),
      reviewNote: optional(string()),
    }),
    get: selectStruct("report", 2),
  });
};
