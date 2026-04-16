import {
  boolean,
  defaulted,
  optional,
  type RelationDataType,
  string,
} from "@deps";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import {
  file_excludes,
  shared_relation_excludes,
  user_excludes,
} from "./excludes.ts";

export const blogPost_pure = {
  title: string(),
  slug: string(),
  content: string(),
  isPublished: defaulted(boolean(), false),
  publishedAt: optional(string()), // Date as string
  ...createUpdateAt,
};

export const blogPost_relations = {
  author: {
    schemaName: "user",
    type: "single" as RelationDataType,
    optional: false,
    excludes: user_excludes,
    relatedRelations: {
      blogPosts: {
        type: "multiple" as RelationDataType,
        excludes: ["createdAt", "updatedAt"],
      },
    },
  },
  coverImage: {
    schemaName: "file",
    type: "single" as RelationDataType,
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
      blogPosts: {
        type: "multiple" as RelationDataType,
        limit: 50,
        excludes: ["createdAt", "updatedAt"],
        sort: {
          field: "_id",
          order: "desc",
        },
      },
    },
  },
};

export const blogPosts = () =>
  coreApp.odm.newModel("blogPost", blogPost_pure, blogPost_relations, {
    createIndex: {
      indexSpec: {
        slug: 1,
      },
      options: {
        unique: true,
      },
    },
  });

export const createBlogPostTextIndex = async () => {
  const db = coreApp.odm.getDb();
  const collection = db.collection("blogPost");
  await collection.createIndex({
    title: "text",
    content: "text",
  });
};
