import {
  boolean,
  defaulted,
  nullable,
  number,
  optional,
  type RelationDataType,
  string,
} from "lesan";
import { coreApp } from "../mod.ts";
import { createUpdateAt } from "@lib";
import { file_excludes } from "./excludes.ts";

export const heroSlide_pure = {
  title: string(),
  subtitle: string(),
  gradient: defaulted(nullable(string()), null),
  ctaText: string(),
  ctaLink: string(),
  secondaryCtaText: optional(nullable(string())),
  secondaryCtaLink: optional(nullable(string())),
  order: defaulted(number(), 0),
  isActive: defaulted(boolean(), true),
  ...createUpdateAt,
};

export const heroSlide_relations = {
  image: {
    schemaName: "file",
    type: "single" as RelationDataType,
    optional: true,
    excludes: file_excludes,
    relatedRelations: {},
  },
};

export const heroSlides = () =>
  coreApp.odm.newModel("heroSlide", heroSlide_pure, heroSlide_relations);
