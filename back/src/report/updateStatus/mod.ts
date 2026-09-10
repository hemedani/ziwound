import { setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { updateStatusFn } from "./updateStatus.fn.ts";
import { updateStatusValidator } from "./updateStatus.val.ts";

export const updateStatusSetup = () =>
  coreApp.acts.setAct({
    schema: "report",
    fn: updateStatusFn,
    actName: "updateStatus",
    preAct: [setTokens, setUser],
    validator: updateStatusValidator(),
    validationRunType: "create",
  });
