import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { unpublishFn } from "./unpublish.fn.ts";
import { unpublishValidator } from "./unpublish.val.ts";

export const unpublishSetup = () =>
  coreApp.acts.setAct({
    schema: "blogPost",
    fn: unpublishFn,
    actName: "unpublish",
    preAct: [
      setTokens,
      setUser,
      grantAccess({
        levels: ["Manager", "Editor"],
      }),
    ],
    validator: unpublishValidator(),
    validationRunType: "create",
  });
