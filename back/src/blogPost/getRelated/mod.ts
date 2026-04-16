import { coreApp } from "../../../mod.ts";
import { getRelatedFn } from "./getRelated.fn.ts";
import { getRelatedValidator } from "./getRelated.val.ts";

export const getRelatedSetup = () =>
  coreApp.acts.setAct({
    schema: "blogPost",
    fn: getRelatedFn,
    actName: "getRelated",
    preAct: [],
    validator: getRelatedValidator(),
    validationRunType: "create",
  });
