import { coreApp } from "../mod.ts";
import {
  optional,
  type RelationDataType,
  type RelationSortOrderType,
} from "lesan";
import { pure_location, user_excludes } from "@model";
import { localizedWarInfo } from "./utils/localizedFields.ts";

export const city_pure = {
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
