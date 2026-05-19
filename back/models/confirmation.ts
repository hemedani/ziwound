import {
  boolean,
  coerce,
  defaulted,
  enums,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "lesan";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  confirmation_excludes,
  file_excludes,
  report_excludes,
  user_excludes,
} from "./excludes.ts";
import { language_enums, type LanguageCode } from "./document.ts";

export const confirmation_type_array = [
  "Diary",
  "Eyewitness",
  "OfficialStatement",
  "MediaNote",
  "Other",
] as const;

export const confirmation_pure = {
  title: string(),
  content: string(),
  type: defaulted(
    coerce(
      enums(confirmation_type_array),
      string(),
      (value) => value as typeof confirmation_type_array[number],
    ),
    "Eyewitness",
  ),
  badge: string(),
  isVerified: defaulted(boolean(), false),
  selected_language: coerce(
    language_enums,
    string(),
    (value) => value as LanguageCode,
  ),
  ...createUpdateAt,
};

export const confirmation_relations = {
  author: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: false,
    excludes: user_excludes,
    relatedRelations: {
      confirmations: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: confirmation_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  report: {
    schemaName: "report",
    type: "single" as RelationDataType,
    optional: false,
    excludes: report_excludes,
    relatedRelations: {
      confirmations: {
        type: "multiple" as RelationDataType,
        limit: 30,
        excludes: confirmation_excludes,
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
  supportingFiles: {
    schemaName: "file",
    type: "multiple" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
  },
};

export const confirmations = () =>
  coreApp.odm.newModel(
    "confirmation",
    confirmation_pure,
    confirmation_relations,
    {
      createIndex: {
        indexSpec: {
          title: "text",
          content: "text",
        },
      },
    },
  );
