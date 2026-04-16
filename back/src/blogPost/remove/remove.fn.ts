import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const removeFn: ActFn = async (body) => {
  const {
    set: { _id, hardCascade },
    get,
  } = body.details;

  return await blogPost.deleteOne({
    filter: { _id: new ObjectId(_id) },
    get,
    hardCascade,
  });
};