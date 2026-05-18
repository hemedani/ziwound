import {
  array,
  boolean,
  date,
  enums,
  object,
  objectIdValidation,
  optional,
  string,
} from "lesan";
import { selectStruct } from "../../../mod.ts";
import {
  warCriminal_affiliation_array,
  warCriminal_status_array,
} from "@model";
import { localizedWarInfo } from "@model";

export const updateValidator = () => {
  return object({
    set: object({
      _id: objectIdValidation,
      fullName: optional(string()),
      aliases: optional(array(string())),
      dateOfBirth: optional(date()),
      nationality: optional(array(string())),
      affiliation: optional(enums(warCriminal_affiliation_array)),
      rankOrPosition: optional(string()),
      knownFor: optional(localizedWarInfo),
      biography: optional(localizedWarInfo),
      description: optional(localizedWarInfo),
      status: optional(enums(warCriminal_status_array)),
      convictionDetails: optional(localizedWarInfo),
      isEntity: optional(boolean()),
    }),
    get: selectStruct("warCriminal", 2),
  });
};
