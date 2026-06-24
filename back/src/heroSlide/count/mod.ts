import { coreApp } from "../../../mod.ts";
import { countFn } from "./count.fn.ts";
import { countValidator } from "./count.val.ts";

export const countSetup = () =>
  coreApp.acts.setAct({
    schema: "heroSlide",
    fn: countFn,
    actName: "count",
    validator: countValidator(),
  });
