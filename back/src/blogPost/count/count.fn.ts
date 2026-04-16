import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: { search, isPublished, authorId, tagIds },
  } = body.details;

  const filter: any = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (isPublished !== undefined) {
    filter.isPublished = isPublished;
  }

  if (authorId) {
    filter["author._id"] = new ObjectId(authorId);
  }

  if (tagIds && tagIds.length > 0) {
    filter["tags._id"] = { $in: tagIds.map((id: string) => new ObjectId(id)) };
  }

  return await blogPost.countDocument({ filter });
};