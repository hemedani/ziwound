import {
  coerce,
  date,
  defaulted,
  enums,
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "lesan";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  document_excludes,
  location_excludes,
  report_excludes,
  shared_relation_excludes,
  user_excludes,
} from "./excludes.ts";
import { geoJSONStruct } from "./utils/geoJSONStruct.ts";
import { language_enums, type LanguageCode } from "./document.ts";

export const report_status_array = [
  "Pending",
  "Approved",
  "Rejected",
  "InReview",
];
export const report_status_emums = enums(report_status_array);

export const report_pure = {
  title: string(),
  description: string(),
  location: optional(geoJSONStruct("Point")),
  address: optional(string()),
  status: defaulted(
    coerce(
      report_status_emums,
      string(),
      (value) => value as typeof report_status_array[number],
    ),
    "Pending",
  ),
  priority: optional(
    coerce(
      enums(["Low", "Medium", "High"]),
      string(),
      (value) => value as "Low" | "Medium" | "High",
    ),
  ),
  selected_language: coerce(
    language_enums,
    string(),
    (value) => value as LanguageCode,
  ),
  crime_occurred_at: coerce(date(), string(), (value) => new Date(value)),
  ...createUpdateAt,
};

export const report_relations = {
  reporter: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: false,
    excludes: user_excludes,
    relatedRelations: {
      reports: {
        type: "multiple" as RelationDataType,
        limit: 100,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  documents: {
    schemaName: "document",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: document_excludes,
    relatedRelations: {
      report: {
        type: "single" as RelationDataType,
        excludes: report_excludes,
      },
    },
  },
  tags: {
    schemaName: "tag",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: shared_relation_excludes,
    relatedRelations: {
      reports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  category: {
    schemaName: "category",
    type: "single" as RelationDataType,
    optional: true,
    excludes: shared_relation_excludes,
    relatedRelations: {
      reports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  hostileCountries: {
    schemaName: "country",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {
      hostileReports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  attackedCountries: {
    schemaName: "country",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {
      attackedReports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  attackedProvinces: {
    schemaName: "province",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {
      attackedByReports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  attackedCities: {
    schemaName: "city",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: location_excludes,
    relatedRelations: {
      attackedByReports: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: report_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
};

export const reports = () =>
  coreApp.odm.newModel("report", report_pure, report_relations, {
    createIndex: {
      indexSpec: {
        title: "text",
        description: "text",
      },
    },
  });
