import { enums, object, objectIdValidation, optional, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const decideValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      decision: enums(["Approved", "Rejected"]),
      reviewNote: optional(string()),
    }),
    get: selectStruct("regionalManagerRequest", 2),
  });
};
