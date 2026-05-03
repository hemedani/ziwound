import { coreApp } from "../mod.ts";
import { type RelationDataType, type RelationSortOrderType, string } from "lesan";
import { pure_location } from "@model";
import { user_excludes } from "./excludes.ts";

export const province_pure = {
  ...pure_location,

  wars_history: string(),
  conflict_timeline: string(),
  casualties_info: string(),
  notable_battles: string(),
  occupation_info: string(),
  destruction_level: string(),
  civilian_impact: string(),
  mass_graves_info: string(),
  war_crimes_events: string(),
  liberation_info: string(),
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
