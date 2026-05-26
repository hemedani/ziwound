import { coreApp } from "../../../mod.ts";
import { getUsersFn } from "./getUsers.fn.ts";
import { getUsersValidator } from "./getUsers.val.ts";

export const getUsersSetup = () =>
  coreApp.acts.setAct({
    schema: "user",
    fn: getUsersFn,
    actName: "getUsers",
    validator: getUsersValidator(),
  });
