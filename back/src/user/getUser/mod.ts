import { coreApp } from "../../../mod.ts";
import { getUserFn } from "./getUser.fn.ts";
import { getUserValidator } from "./getUser.val.ts";

export const getUserSetup = () =>
  coreApp.acts.setAct({
    schema: "user",
    actName: "getUser",
    validator: getUserValidator(),
    fn: getUserFn,
  });
