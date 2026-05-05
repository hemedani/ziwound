import { coreApp } from "../mod.ts";
import {
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "lesan";
import { pure_location } from "@model";
import { user_excludes } from "./excludes.ts";

export const city_pure = {
  ...pure_location,

  wars_history: optional(string()),
  conflict_timeline: optional(string()),
  casualties_info: optional(string()),
  notable_battles: optional(string()),
  occupation_info: optional(string()),
  destruction_level: optional(string()),
  civilian_impact: optional(string()),
  mass_graves_info: optional(string()),
  war_crimes_events: optional(string()),
  liberation_info: optional(string()),
};

export const city_relations = {
  registrar: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: true,
    excludes: user_excludes,
    relatedRelations: {},
  },
  province: {
    schemaName: "province",
    type: "single" as RelationDataType,
    optional: true,
    relatedRelations: {
      cities: {
        type: "multiple" as RelationDataType,
        limit: 50,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
      capital: {
        type: "single" as RelationDataType,
      },
    },
  },
  country: {
    schemaName: "country",
    type: "single" as RelationDataType,
    optional: true,
    relatedRelations: {
      cities: {
        type: "multiple" as RelationDataType,
        limit: 50,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
};

export const cities = () =>
  coreApp.odm.newModel("city", city_pure, city_relations, {
    createIndex: {
      indexSpec: {
        name: "text",
        english_name: "text",
        wars_history: "text",
        conflict_timeline: "text",
        war_crimes_events: "text",
        notable_battles: "text",
      },
    },
  });
