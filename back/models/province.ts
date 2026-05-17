import { coreApp } from "../mod.ts";
import { optional, type RelationDataType, type RelationSortOrderType } from "lesan";
import { pure_location, user_excludes } from "@model";
import { localizedWarInfo } from "./utils/localizedFields.ts";

export const province_pure = {
  ...pure_location,

  wars_history: optional(localizedWarInfo),
  conflict_timeline: optional(localizedWarInfo),
  casualties_info: optional(localizedWarInfo),
  notable_battles: optional(localizedWarInfo),
  occupation_info: optional(localizedWarInfo),
  destruction_level: optional(localizedWarInfo),
  civilian_impact: optional(localizedWarInfo),
  mass_graves_info: optional(localizedWarInfo),
  war_crimes_events: optional(localizedWarInfo),
  liberation_info: optional(localizedWarInfo),
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
