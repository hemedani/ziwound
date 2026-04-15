import { getSetup } from "./get/mod.ts";
import { getsSetup } from "./gets/mod.ts";
import { updateSetup } from "./update/mod.ts";
import { uploadFileSetup } from "./uploadFile/mod.ts";

export const fileSetup = () => {
	getSetup(), getsSetup(), updateSetup(), uploadFileSetup();
};
