import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { publishFn } from "./publish.fn.ts";
import { publishValidator } from "./publish.val.ts";

export const publishSetup = () =>
  coreApp.acts.setAct({
    schema: "blogPost",
    fn: publishFn,
    actName: "publish",
    preAct: [
      setTokens,
      setUser,
      grantAccess({
        levels: ["Manager", "Editor"],
      }),
    ],
    validator: publishValidator(),
    validationRunType: "create",
  });
