import { type ActFn, ObjectId } from "lesan";
import { coreApp, warCriminal } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const { tagIds, photoId, ...rest } = set;

  return await warCriminal.insertOne({
    doc: rest,
    relations: {
      tags: tagIds
        ? {
          _ids: tagIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            warCriminals: true,
          },
        }
        : undefined,
      photo: photoId
        ? {
          _ids: new ObjectId(photoId),
        }
        : undefined,
    },
    projection: get,
  });
};
