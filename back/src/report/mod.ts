import { addSetup } from "./add/mod.ts";
import { getSetup } from "./get/mod.ts";
import { getsSetup } from "./gets/mod.ts";
import { updateSetup } from "./update/mod.ts";
import { updateRelationsSetup } from "./updateRelations/mod.ts";
import { removeSetup } from "./remove/mod.ts";
import { countSetup } from "./count/mod.ts";
import { statisticsSetup } from "./statistics/mod.ts";
import { exportCSVSetup } from "./exportCSV/mod.ts";
import { exportPDFSetup } from "./exportPDF/mod.ts";

export const reportSetup = () => {
	addSetup();
	getSetup();
	getsSetup();
	updateSetup();
	updateRelationsSetup();
	removeSetup();
	countSetup();
	statisticsSetup();
	exportCSVSetup();
	exportPDFSetup();
};
