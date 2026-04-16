import { type ActFn } from "@deps";
import { blogPost } from "../../../mod.ts";

export const getBySlugFn: ActFn = async (body) => {
  const {
    set: { slug },
    get,
  } = body.details;

  return await blogPost.findOne({
    filter: { slug },
    projection: get,
  });
};
