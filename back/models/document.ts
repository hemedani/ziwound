import {
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  document_excludes,
  file_excludes,
  report_excludes,
} from "./excludes.ts";

export const document_pure = {
  title: string(),
  description: optional(string()),
  ...createUpdateAt,
};

export const document_relations = {
  documentFiles: {
    schemaName: "file",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
  },
  reportRelations: {
    schemaName: "report",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: report_excludes,
    relatedRelations: {
      documents: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: document_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
};

export const documents = () =>
  coreApp.odm.newModel("document", document_pure, document_relations, {
    createIndex: {
      indexSpec: {
        title: "text",
        description: "text",
      },
    },
  });
