import { fileSetup } from "./file/mod.ts";
import { userSetup } from "./user/mod.ts";
import { citySetup } from "./city/mod.ts";
import { provinceSetup } from "./province/mod.ts";
import { tagSetup } from "./tag/mod.ts";
import { categorySetup } from "./category/mod.ts";
import { reportSetup } from "./report/mod.ts";
import { documentSetup } from "./document/mod.ts";

export const functionsSetup = () => {
  citySetup();
  fileSetup();
  provinceSetup();
  userSetup();
  tagSetup();
  categorySetup();
  reportSetup();
  documentSetup();
};
