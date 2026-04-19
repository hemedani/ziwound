import { type ActFn, ObjectId } from "lesan";
import { blogPost } from "../../../mod.ts";

export const removeFn: ActFn = async (body) => {
  const {
    set: { _id, hardCascade },
  } = body.details;

  return await blogPost.deleteOne({
    filter: { _id: new ObjectId(_id) },
    hardCascade,
  });
};
