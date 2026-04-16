import { type ActFn, ObjectId, type Document } from "@deps";
import { blogPost } from "../../../mod.ts";

export const getFn: ActFn = async (body) => {
  const {
    set: { _id, slug },
    get,
  } = body.details;

  const matchConditions: any = {};
  if (_id) {
    matchConditions._id = new ObjectId(_id);
  }
  if (slug) {
    matchConditions.slug = slug;
  }

  return await blogPost
    .aggregation({
      pipeline: [{ $match: matchConditions }],
      projection: get,
    })
    .toArray()
    .then((results: Document[]) => results[0] || null);
};
