import { coreApp } from "../mod.ts";
import { optional, type RelationDataType } from "lesan";
import { file_excludes, pure_location, user_excludes } from "@model";
import { localizedWarInfo } from "./utils/localizedFields.ts";

export const country_pure = {
  ...pure_location,

  wars_history: optional(localizedWarInfo),
  conflict_timeline: optional(localizedWarInfo),
  casualties_info: optional(localizedWarInfo),
  international_response: optional(localizedWarInfo),
  war_crimes_documentation: optional(localizedWarInfo),
  human_rights_violations: optional(localizedWarInfo),
  genocide_info: optional(localizedWarInfo),
  chemical_weapons_info: optional(localizedWarInfo),
  displacement_info: optional(localizedWarInfo),
  reconstruction_status: optional(localizedWarInfo),
  international_sanctions: optional(localizedWarInfo),
  notable_war_events: optional(localizedWarInfo),
};

export const country_relations = {
  registrar: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: true,
    excludes: user_excludes,
    relatedRelations: {},
  },
  photo: {
    schemaName: "file",
    type: "single" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
  },
};

export const countries = () =>
  coreApp.odm.newModel("country", country_pure, country_relations, {
    createIndex: {
      indexSpec: {
        name: "text",
        english_name: "text",
        wars_history: "text",
        conflict_timeline: "text",
        war_crimes_documentation: "text",
        human_rights_violations: "text",
        genocide_info: "text",
        notable_war_events: "text",
      },
    },
  });
