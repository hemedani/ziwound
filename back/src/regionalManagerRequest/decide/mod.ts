import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { decideFn } from "./decide.fn.ts";
import { decideValidator } from "./decide.val.ts";

export const decideSetup = () =>
  coreApp.acts.setAct({
    schema: "regionalManagerRequest",
    fn: decideFn,
    actName: "decide",
    preAct: [
      setTokens,
      setUser,
      grantAccess({ levels: ["Manager"] }),
    ],
    validator: decideValidator(),
    validationRunType: "create",
  });
