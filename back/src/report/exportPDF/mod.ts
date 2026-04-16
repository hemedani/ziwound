import { coreApp } from "../../../mod.ts";
import { exportPDFFn } from "./exportPDF.fn.ts";
import { exportPDFValidator } from "./exportPDF.val.ts";

export const exportPDFSetup = () =>
  coreApp.acts.setAct({
    schema: "report",
    fn: exportPDFFn,
    actName: "exportPDF",
    preAct: [],
    validator: exportPDFValidator(),
    validationRunType: "create",
  });
