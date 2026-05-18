import {
  array,
  boolean,
  coerce,
  date,
  defaulted,
  enums,
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "lesan";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import { shared_relation_excludes } from "./excludes.ts";
import { localizedWarInfo } from "./utils/localizedFields.ts";

export const warCriminal_status_array = [
  "Accused",
  "Indicted",
  "Convicted",
  "At Large",
  "Deceased",
  "Unknown",
  "Sanctioned",
] as const;

export const warCriminal_affiliation_array = [
  "Military",
  "Paramilitary",
  "Government",
  "Rebel Group",
  "Private Military Company",
  "Political",
  "Other",
] as const;

export const warCriminal_status_enums = enums(warCriminal_status_array);
export const warCriminal_affiliation_enums = enums(
  warCriminal_affiliation_array,
);

export const warCriminal_pure = {
  fullName: string(),
  aliases: optional(array(string())),
  dateOfBirth: optional(coerce(date(), string(), (value) => new Date(value))),
  nationality: optional(array(string())),
  affiliation: optional(
    coerce(
      warCriminal_affiliation_enums,
      string(),
      (value) => value as typeof warCriminal_affiliation_array[number],
    ),
  ),
  rankOrPosition: optional(string()),
  knownFor: optional(localizedWarInfo),
  biography: optional(localizedWarInfo),
  description: optional(localizedWarInfo),
  status: defaulted(
    coerce(
      warCriminal_status_enums,
      string(),
      (value) => value as typeof warCriminal_status_array[number],
    ),
    "Unknown",
  ),
  convictionDetails: optional(localizedWarInfo),
  isEntity: defaulted(boolean(), false),
  ...createUpdateAt,
};

export const warCriminal_relations = {
  tags: {
    schemaName: "tag",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: shared_relation_excludes,
    relatedRelations: {
      warCriminals: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: shared_relation_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  photo: {
    schemaName: "file",
    type: "single" as RelationDataType,
    optional: true,
    excludes: shared_relation_excludes,
    relatedRelations: {},
  },
};

export const warCriminals = () =>
  coreApp.odm.newModel("warCriminal", warCriminal_pure, warCriminal_relations, {
    createIndex: {
      indexSpec: {
        fullName: "text",
        aliases: "text",
        "knownFor.en": "text",
        "knownFor.fa": "text",
        "knownFor.ar": "text",
        "biography.en": "text",
        "biography.fa": "text",
        "biography.ar": "text",
        "description.en": "text",
        "description.fa": "text",
        "description.ar": "text",
        "convictionDetails.en": "text",
        "convictionDetails.fa": "text",
        "convictionDetails.ar": "text",
      },
    },
  });
