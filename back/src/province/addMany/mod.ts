import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { addManyFn } from "./addMany.fn.ts";
import { addManyValidator } from "./addMany.val.ts";

export const addManySetup = () =>
  coreApp.acts.setAct({
    schema: "province",
    fn: addManyFn,
    actName: "addMany",
    preAct: [
      setTokens,
      setUser,
      grantAccess({
        levels: ["Manager"],
      }),
    ],
    validator: addManyValidator(),
    validationRunType: "create",
  });
