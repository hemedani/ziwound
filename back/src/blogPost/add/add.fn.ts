import { type ActFn, ObjectId } from "@deps";
import { coreApp, blogPost } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as MyContext;

  const { set, get } = body.details;

  const { coverImage, tags, ...rest } = set;

  return await blogPost.insertOne({
    doc: rest,
    relations: {
      author: {
        _ids: user._id,
      },
      coverImage: coverImage
        ? {
            _ids: new ObjectId(coverImage),
          }
        : undefined,
      tags: tags
        ? {
            _ids: tags.map((id: string) => new ObjectId(id)),
            relatedRelations: {
              blogPosts: true,
            },
          }
        : undefined,
    },
    projection: get,
  });
};