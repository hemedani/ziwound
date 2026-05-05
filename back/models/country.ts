import { coreApp } from "../mod.ts";
import { optional, type RelationDataType, string } from "lesan";
import { pure_location, user_excludes } from "@model";

export const country_pure = {
  ...pure_location,

  wars_history: optional(string()),
  conflict_timeline: optional(string()),
  casualties_info: optional(string()),
  international_response: optional(string()),
  war_crimes_documentation: optional(string()),
  human_rights_violations: optional(string()),
  genocide_info: optional(string()),
  chemical_weapons_info: optional(string()),
  displacement_info: optional(string()),
  reconstruction_status: optional(string()),
  international_sanctions: optional(string()),
  notable_war_events: optional(string()),
};

export const country_relations = {
  registrar: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: true,
    excludes: user_excludes,
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
