import { coreApp } from "../mod.ts";
import {
  optional,
  type RelationDataType,
  type RelationSortOrderType,
} from "lesan";
import { file_excludes, pure_location, user_excludes } from "@model";
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
  photo: {
    schemaName: "file",
    type: "single" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
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

/**
 * The world import seeds ~153k cities, and the location pickers always narrow a
 * name search down to one province. Without an index on the embedded parent
 * relation that is a full collection scan per keystroke.
 *
 * The model's single `createIndex` slot is already taken by the text index, so
 * these are created here — same pattern as `createUserTextIndex` — and are
 * idempotent, so they are safe to run on every boot.
 */
export const createCityParentIndexes = async () => {
  const collection = coreApp.odm.getCollection("city");
  try {
    await collection.createIndex({ "province._id": 1 }, { name: "province_id_1" });
  } catch (error) {
    console.log(
      "city index province_id_1 already exists or creation failed:",
      (error as Error).message,
    );
  }
  try {
    await collection.createIndex({ "country._id": 1 }, { name: "country_id_1" });
  } catch (error) {
    console.log(
      "city index country_id_1 already exists or creation failed:",
      (error as Error).message,
    );
  }
};
