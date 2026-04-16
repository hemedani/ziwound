import { type ActFn, ObjectId } from "@deps";
import { blogPost } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, coverImage, tags, removeTags },
    get,
  } = body.details;

  const blogPostId = new ObjectId(_id);

  if (coverImage) {
    await blogPost.addRelation({
      filters: { _id: blogPostId },
      relations: {
        coverImage: {
          _ids: new ObjectId(coverImage),
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (tags) {
    await blogPost.addRelation({
      filters: { _id: blogPostId },
      relations: {
        tags: {
          _ids: tags.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            blogPosts: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (removeTags) {
    await blogPost.removeRelation({
      filters: { _id: blogPostId },
      relations: {
        tags: {
          _ids: removeTags.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            blogPosts: true,
          },
        },
      },
      projection: get,
    });
  }

  return await blogPost.findOne({
    filters: { _id: blogPostId },
    projection: get,
  });
};