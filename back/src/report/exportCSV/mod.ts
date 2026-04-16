import { coreApp } from "../../../mod.ts";
import { exportCSVFn } from "./exportCSV.fn.ts";
import { exportCSVValidator } from "./exportCSV.val.ts";

export const exportCSVSetup = () =>
  coreApp.acts.setAct({
    schema: "report",
    fn: exportCSVFn,
    actName: "exportCSV",
    preAct: [],
    validator: exportCSVValidator(),
    validationRunType: "create",
  });
