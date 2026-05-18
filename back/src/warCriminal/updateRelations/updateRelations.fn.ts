import { type ActFn, ObjectId } from "lesan";
import { warCriminal } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      tagIds,
      tagIdsToRemove,
      photoId,
    },
    get,
  } = body.details;

  const warCriminalId = new ObjectId(_id);

  if (tagIds) {
    await warCriminal.addRelation({
      filters: { _id: warCriminalId },
      relations: {
        tags: {
          _ids: tagIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            warCriminals: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (tagIdsToRemove) {
    await warCriminal.removeRelation({
      filters: { _id: warCriminalId },
      relations: {
        tags: {
          _ids: tagIdsToRemove.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            warCriminals: true,
          },
        },
      },
      projection: get,
    });
  }

  if (photoId) {
    await warCriminal.addRelation({
      filters: { _id: warCriminalId },
      relations: {
        photo: {
          _ids: new ObjectId(photoId),
        },
      },
      projection: get,
      replace: true,
    });
  }

  return await warCriminal.findOne({
    filters: { _id: warCriminalId },
    projection: get,
  });
};
