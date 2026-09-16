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
 * The world import seeds ~153k cities, which makes two query shapes expensive
 * without help:
 *
 *   1. A name search narrowed to one province. Without an index on the embedded
 *      parent relation that is a full collection scan on every keystroke.
 *   2. Browsing cities sorted by name — what the public explore page does when
 *      no filter is set. Sorting 153k documents is a blocking in-memory sort
 *      that does not finish inside the request timeout; with an index on `name`
 *      MongoDB walks it in order and stops after the page size, so the cost is
 *      O(limit) instead of O(n log n).
 *
 * The model's single `createIndex` slot is already taken by the text index, so
 * these are created here — same pattern as `createUserTextIndex` — and are
 * idempotent, so they are safe to run on every boot.
 *
 * The compound keys also cover their single-field prefix, and let a
 * province-scoped, name-sorted search skip the sort step entirely.
 */
export const createCityIndexes = async () => {
  const collection = coreApp.odm.getCollection("city");

  const indexes: { spec: Record<string, 1>; name: string }[] = [
    { spec: { "province._id": 1 }, name: "province_id_1" },
    { spec: { "country._id": 1 }, name: "country_id_1" },
    { spec: { name: 1 }, name: "name_1" },
    { spec: { "province._id": 1, name: 1 }, name: "province_id_1_name_1" },
    { spec: { "country._id": 1, name: 1 }, name: "country_id_1_name_1" },
  ];

  for (const { spec, name } of indexes) {
    try {
      await collection.createIndex(spec, { name });
    } catch (error) {
      console.log(
        `city index ${name} already exists or creation failed:`,
        (error as Error).message,
      );
    }
  }
};
