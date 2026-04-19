import { object, string } from "lesan";
import { selectStruct } from "../../../mod.ts";

export const getBySlugValidator = () => {
  return object({
    set: object({
      slug: string(),
    }),
    get: selectStruct("blogPost", 2),
  });
};
