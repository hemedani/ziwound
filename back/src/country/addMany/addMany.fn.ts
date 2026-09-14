import { type ActFn, ObjectId } from "lesan";
import { coreApp, country } from "../../../mod.ts";
import type { MyContext } from "@lib";

/**
 * Bulk-insert countries in a single round trip.
 *
 * Accepts an array of items (pure fields + optional `_id`) and delegates to the
 * ODM `insertMany`, which is a single MongoDB `insertMany` call. The `registrar`
 * relation is attached to every document.
 */
export const addManyFn: ActFn = async (body) => {
  const { set: { items }, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as MyContext;

  if (!items || items.length === 0) return [];

  const docs = (items as { _id?: string; [key: string]: unknown }[]).map(
    ({ _id, ...rest }) => ({
      ...(_id ? { _id: new ObjectId(_id) } : {}),
      ...rest,
    }),
  );

  return await country.insertMany({
    docs,
    relations: {
      registrar: {
        _ids: user._id,
      },
    },
    // `ordered: false` makes the bulk insert idempotent: documents whose `_id`
    // already exists are skipped while the rest of the batch still lands. This
    // is what allows a long world import to be safely re-run / resumed.
    options: { ordered: false },
    projection: get,
  });
};
