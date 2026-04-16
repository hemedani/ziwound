import { coreApp } from "../../../mod.ts";
import { statisticsFn } from "./statistics.fn.ts";
import { statisticsValidator } from "./statistics.val.ts";

export const statisticsSetup = () =>
  coreApp.acts.setAct({
    schema: "report",
    fn: statisticsFn,
    actName: "statistics",
    preAct: [],
    validator: statisticsValidator(),
    validationRunType: "create",
  });
