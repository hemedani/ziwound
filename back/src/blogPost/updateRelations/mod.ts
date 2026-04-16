import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { updateRelationsFn } from "./updateRelations.fn.ts";
import { updateRelationsValidator } from "./updateRelations.val.ts";

export const updateRelationsSetup = () =>
  coreApp.acts.setAct({
    schema: "blogPost",
    fn: updateRelationsFn,
    actName: "updateRelations",
    preAct: [
      setTokens,
      setUser,
      grantAccess({
        levels: ["Manager", "Editor"],
      }),
    ],
    validator: updateRelationsValidator(),
    validationRunType: "create",
  });