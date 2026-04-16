import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const unpublishFn: ActFn = async (body) => {
  const {
    set: { _id },
    get,
  } = body.details;

  const updateObj = {
    isPublished: false,
    updatedAt: new Date(),
  };

  return await blogPost.findOneAndUpdate({
    filter: { _id: new ObjectId(_id) },
    update: { $set: updateObj },
    projection: get,
  });
};
