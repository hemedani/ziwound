import { type ActFn, ObjectId } from "lesan";
import { blogPost } from "../../../mod.ts";

export const getRelatedFn: ActFn = async (body) => {
  const {
    set: { slug, limit = 5 },
    get,
  } = body.details;

  // Find the current post by slug
  const currentPost = await blogPost.findOne({
    filters: { slug },
    projection: { _id: 1, "tags._id": 1 },
  });

  if (!currentPost) {
    return null;
  }

  const tagIds = currentPost.tags?.map((tag: any) => tag._id) || [];

  if (tagIds.length === 0) {
    return [];
  }

  const pipeline: any[] = [
    {
      $match: {
        "tags._id": { $in: tagIds.map((id: any) => new ObjectId(id)) },
        _id: { $ne: currentPost._id },
        isPublished: true, // Only published posts
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: limit,
    },
  ];

  return await blogPost
    .aggregation({
      pipeline,
      projection: get,
    })
    .toArray();
};
