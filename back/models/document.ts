import { optional, type RelationDataType, string } from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  file_excludes,
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
