import { coreApp } from "../mod.ts";
import { optional, type RelationDataType, type RelationSortOrderType } from "lesan";
import { file_excludes, pure_location, user_excludes } from "@model";
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
  photo: {
    schemaName: "file",
    type: "single" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
  },
};

/**
 * `country` and `city` both declare a text index over `name` / `english_name`
 * plus the main war-info fields; `province` was created with an empty options
 * object and so had none. Any `province.gets` call passing `search` therefore
 * failed outright with "text index required for $text query", which silently
 * emptied the province dropdown in the war-crimes filter and the report form.
 * The spec below mirrors `cities()`.
 */
export const provinces = () =>
  coreApp.odm.newModel("province", province_pure, province_relations, {
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
 * Provinces are always listed for one country, so index the embedded parent
 * relation. Idempotent — safe to run on every boot. See `createCityParentIndexes`.
 */
export const createProvinceParentIndex = async () => {
  const collection = coreApp.odm.getCollection("province");
  try {
    await collection.createIndex({ "country._id": 1 }, { name: "country_id_1" });
  } catch (error) {
    console.log(
      "province index country_id_1 already exists or creation failed:",
      (error as Error).message,
    );
  }
};
