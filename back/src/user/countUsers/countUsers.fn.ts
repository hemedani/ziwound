import type { ActFn, Document } from "lesan";
import { user } from "../../../mod.ts";

export const countUsersFn: ActFn = async (body) => {
  const {
    set: { levels },
    get,
  } = body.details;

  const filter: Document = {};
  levels && levels.length > 0 && (filter.level = { $in: levels });

  const qty = await user.countDocument({
    filter,
  });

  return { qty };
};
