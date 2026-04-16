import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const updateFn: ActFn = async (body) => {
  const {
    set: { _id, ...rest },
    get,
  } = body.details;

  const updateObj: any = {
    updatedAt: new Date(),
  };

  // Conditionally update fields
  if (rest.title !== undefined) updateObj.title = rest.title;
  if (rest.slug !== undefined) updateObj.slug = rest.slug;
  if (rest.content !== undefined) updateObj.content = rest.content;
  if (rest.isPublished !== undefined) updateObj.isPublished = rest.isPublished;
  if (rest.publishedAt !== undefined) updateObj.publishedAt = rest.publishedAt;

  return await blogPost.findOneAndUpdate({
    filter: { _id: new ObjectId(_id) },
    update: { $set: updateObj },
    projection: get,
  });
};