import {
  defaulted,
  enums,
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  comment_excludes,
  file_excludes,
  shared_relation_excludes,
  user_excludes,
} from "./excludes.ts";
import { geoJSONStruct } from "./utils/geoJSONStruct.ts";

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
  status: defaulted(report_status_emums, "Pending"),
  priority: optional(enums(["Low", "Medium", "High"])),
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
        excludes: comment_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  attachments: {
    schemaName: "file",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
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
        excludes: comment_excludes,
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
        excludes: comment_excludes,
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
