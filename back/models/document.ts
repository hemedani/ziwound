import { optional, type RelationDataType, string } from "@deps";
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
  report: {
    schemaName: "report",
    type: "single" as RelationDataType,
    optional: false,
    excludes: report_excludes,
    relatedRelations: {
      documents: {
        type: "multiple" as RelationDataType,
        excludes: document_excludes,
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
