import { coerce, enums, optional, type RelationDataType, string } from "lesan";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import { file_excludes } from "./excludes.ts";

export const language_array = [
  "en",
  "zh",
  "hi",
  "es",
  "fr",
  "ar",
  "pt",
  "ru",
  "ja",
  "pa",
  "de",
  "id",
  "te",
  "mr",
  "tr",
  "ta",
  "vi",
  "ko",
  "it",
  "fa",
  "nl",
  "sv",
  "pl",
  "uk",
  "ro",
] as const;

export type LanguageCode = typeof language_array[number];

export const language_enums = enums(language_array);

export const document_pure = {
  title: string(),
  description: optional(string()),
  selected_language: optional(
    coerce(language_enums, string(), (value) => value as LanguageCode),
  ),
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
