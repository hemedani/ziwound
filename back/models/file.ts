import {
  enums,
  number,
  optional,
  type RelationDataType,
  type RelationSortOrderType,
  string,
} from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import { user_excludes } from "./excludes.ts";

export const pure_file = {
  name: string(),
  mimType: string(),
  size: number(),
  type: enums(["image", "video", "docs"]),
  alt_text: optional(string()),
  ...createUpdateAt,
};

export const file_relations = {
  uploader: {
    schemaName: "user",
    optional: false,
    type: "single" as RelationDataType,
    excludes: user_excludes,
    relatedRelations: {
      uploadedAssets: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: ["createdAt", "updatedAt", "size"], // Using the same excludes as file_excludes
        sort: {
          field: "_id",
          order: "desc" as RelationSortOrderType,
        },
      },
    },
  },
};

export const files = () =>
  coreApp.odm.newModel(
    "file",
    pure_file,
    file_relations,
    {
      createIndex: {
        indexSpec: {
          name: "text",
          alt_text: "text",
        },
      },
    },
  );
