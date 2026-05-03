import { coreApp } from "../mod.ts";
import { type RelationDataType, type RelationSortOrderType, string } from "lesan";
import { pure_location, user_excludes } from "@model";

export const country_pure = {
  ...pure_location,

  wars_history: string(),
  conflict_timeline: string(),
  casualties_info: string(),
  international_response: string(),
  war_crimes_documentation: string(),
  human_rights_violations: string(),
  genocide_info: string(),
  chemical_weapons_info: string(),
  displacement_info: string(),
  reconstruction_status: string(),
  international_sanctions: string(),
  notable_war_events: string(),
};

export const country_relations = {
  registrar: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: true,
    excludes: user_excludes,
    relatedRelations: {},
  },
  provinces: {
    schemaName: "province",
    type: "multiple" as RelationDataType,
    optional: true,
    relatedRelations: {
      country: {
        type: "single" as RelationDataType,
      },
    },
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
