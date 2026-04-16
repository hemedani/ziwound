import { coreApp } from "../../../mod.ts";
import { getBySlugFn } from "./getBySlug.fn.ts";
import { getBySlugValidator } from "./getBySlug.val.ts";

export const getBySlugSetup = () =>
  coreApp.acts.setAct({
    schema: "blogPost",
    fn: getBySlugFn,
    actName: "getBySlug",
    preAct: [],
    validator: getBySlugValidator(),
    validationRunType: "create",
  });
