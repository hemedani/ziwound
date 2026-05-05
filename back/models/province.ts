import { coreApp } from "../mod.ts";
import { optional, type RelationDataType, type RelationSortOrderType, string } from "lesan";
import { pure_location } from "@model";
import { user_excludes } from "./excludes.ts";

export const province_pure = {
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

export const province_relations = {
  registrar: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: true,
    excludes: user_excludes,
    relatedRelations: {},
  },
  country: {
    schemaName: "country",
    type: "single" as RelationDataType,
    optional: true,
    relatedRelations: {
      provinces: {
        type: "multiple" as RelationDataType,
        limit: 100,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
};

export const provinces = () =>
  coreApp.odm.newModel("province", province_pure, province_relations, {});
