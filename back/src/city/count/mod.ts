import { countFn } from "./count.fn.ts";
import { countValidator } from "./count.val.ts";
import { coreApp } from "../../../mod.ts";

export const countSetup = () =>
  coreApp.acts.setAct({
    schema: "city",
    fn: countFn,
    actName: "count",
    validator: countValidator(),
  });
