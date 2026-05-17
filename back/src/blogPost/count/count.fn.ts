import { type ActFn, ObjectId } from "lesan";
import { blogPost } from "../../../mod.ts";

export const countFn: ActFn = async (body) => {
  const {
    set: { search, isPublished, authorId, tagIds, selected_language },
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

  if (selected_language) {
    filter.selected_language = selected_language;
  }

  return await blogPost.countDocument({ filter });
};