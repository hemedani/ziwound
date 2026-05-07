import { addSetup } from "./add/mod.ts";
import { countSetup } from "./count/mod.ts";
import { getSetup } from "./get/mod.ts";
import { getsSetup } from "./gets/mod.ts";
import { removeSetup } from "./remove/mod.ts";
import { updateSetup } from "./update/mod.ts";

export const heroSlideSetup = () => {
  addSetup();
  updateSetup();
  getSetup();
  getsSetup();
  removeSetup();
  countSetup();
};
