import {
  coerce,
  date,
  defaulted,
  enums,
  type RelationDataType,
  type RelationSortOrderType,
  optional,
  string,
} from "lesan";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  location_excludes,
  regionalManagerRequest_excludes,
  user_excludes,
} from "./excludes.ts";

export const regional_manager_request_status_array = [
  "Pending",
  "Approved",
  "Rejected",
] as const;

export const regional_manager_request_area_type_array = [
  "Country",
  "Province",
  "City",
] as const;

export const regionalManagerRequest_pure = {
  status: defaulted(
    coerce(
      enums(regional_manager_request_status_array),
      string(),
      (value) => value as typeof regional_manager_request_status_array[number],
    ),
    "Pending",
  ),
  areaType: coerce(
    enums(regional_manager_request_area_type_array),
    string(),
    (value) => value as typeof regional_manager_request_area_type_array[number],
  ),
  justification: optional(string()),
  reviewNote: optional(string()),
  decidedAt: optional(date()),
  ...createUpdateAt,
};

export const regionalManagerRequest_relations = {
  user: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: false,
    excludes: user_excludes,
    relatedRelations: {
      regionalManagerRequests: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: regionalManagerRequest_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  country: {
    schemaName: "country",
    type: "single" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {},
  },
  province: {
    schemaName: "province",
    type: "single" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {},
  },
  city: {
    schemaName: "city",
    type: "single" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {},
  },
  reviewedBy: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: true,
    excludes: user_excludes,
    relatedRelations: {},
  },
};

export const regionalManagerRequests = () =>
  coreApp.odm.newModel(
    "regionalManagerRequest",
    regionalManagerRequest_pure,
    regionalManagerRequest_relations,
    {
      createIndex: {
        indexSpec: {
          status: 1,
        },
      },
    },
  );
