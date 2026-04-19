import { object } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const statisticsValidator = () => {
  return object({
    set: object({}),
    get: selectStruct("report", 1),
  });
};
