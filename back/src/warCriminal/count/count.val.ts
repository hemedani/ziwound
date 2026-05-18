import { boolean, enums, object, optional, string } from "lesan";
import {
  warCriminal_affiliation_array,
  warCriminal_status_array,
} from "@model";

export const countValidator = () => {
  return object({
    set: object({
      search: optional(string()),
      status: optional(enums(warCriminal_status_array)),
      affiliation: optional(enums(warCriminal_affiliation_array)),
      isEntity: optional(boolean()),
    }),
    get: object({ qty: optional(string()) }),
  });
};
