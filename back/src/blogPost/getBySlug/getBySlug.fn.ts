import { type ActFn } from "lesan";
import { blogPost } from "../../../mod.ts";

export const getBySlugFn: ActFn = async (body) => {
  const {
    set: { slug },
    get,
  } = body.details;

  return await blogPost.findOne({
    filters: { slug },
    projection: get,
  });
};
