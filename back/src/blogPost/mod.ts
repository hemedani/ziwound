import { addSetup } from "./add/mod.ts";
import { getSetup } from "./get/mod.ts";
import { getsSetup } from "./gets/mod.ts";
import { updateSetup } from "./update/mod.ts";
import { updateRelationsSetup } from "./updateRelations/mod.ts";
import { removeSetup } from "./remove/mod.ts";
import { countSetup } from "./count/mod.ts";
import { publishSetup } from "./publish/mod.ts";
import { unpublishSetup } from "./unpublish/mod.ts";

export const blogPostSetup = () => {
  addSetup();
  getSetup();
  getsSetup();
  updateSetup();
  updateRelationsSetup();
  removeSetup();
  countSetup();
  publishSetup();
  unpublishSetup();
};
