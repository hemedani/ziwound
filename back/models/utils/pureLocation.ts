import { string } from "lesan";
import { createUpdateAt } from "../../utils/createUpdateAt.ts";

export const pure_location = {
  name: string(),
  english_name: string(),

  ...createUpdateAt,
};
