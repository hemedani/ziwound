import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const publishFn: ActFn = async (body) => {
  const {
    set: { _id },
    get,
  } = body.details;

  const updateObj: any = {
    isPublished: true,
    updatedAt: new Date(),
  };

  // Check if publishedAt is already set, if not, set it
  const existingPost = await blogPost.findOne({
    filter: { _id: new ObjectId(_id) },
    projection: { publishedAt: 1 },
  });

  if (!existingPost?.publishedAt) {
    updateObj.publishedAt = new Date();
  }

  return await blogPost.findOneAndUpdate({
    filter: { _id: new ObjectId(_id) },
    update: { $set: updateObj },
    projection: get,
  });
};
