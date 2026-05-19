import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { countFn } from "./count.fn.ts";
import { countValidator } from "./count.val.ts";

export const countSetup = () =>
  coreApp.acts.setAct({
    schema: "confirmation",
    fn: countFn,
    actName: "count",
    preAct: [
      setTokens,
      setUser,
      grantAccess({
        levels: ["Manager", "Editor", "Reporter", "Artist", "Diplomat", "Researcher", "Ordinary"],
      }),
    ],
    validator: countValidator(),
    validationRunType: "create",
  });
