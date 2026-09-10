import { setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { getsMyAreaFn } from "./getsMyArea.fn.ts";
import { getsMyAreaValidator } from "./getsMyArea.val.ts";

export const getsMyAreaSetup = () =>
  coreApp.acts.setAct({
    schema: "report",
    fn: getsMyAreaFn,
    actName: "getsMyArea",
    preAct: [setTokens, setUser],
    validator: getsMyAreaValidator(),
  });
