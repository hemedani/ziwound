import { object, objectIdValidation } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const exportPDFValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
    }),
    get: selectStruct("report", 2),
  });
};
