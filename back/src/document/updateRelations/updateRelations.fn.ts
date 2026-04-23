import { type ActFn, ObjectId } from "lesan";
import { document } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, documentFileIds, documentFileIdsToRemove },
    get,
  } = body.details;

  const documentId = new ObjectId(_id);

  if (documentFileIds) {
    await document.addRelation({
      filters: { _id: documentId },
      relations: {
        documentFiles: {
          _ids: documentFileIds.map((id: string) => new ObjectId(id)),
        },
      },
      projection: get,
    });
  }

  if (documentFileIdsToRemove) {
    await document.removeRelation({
      filters: { _id: documentId },
      relations: {
        documentFiles: {
          _ids: documentFileIdsToRemove.map((id: string) => new ObjectId(id)),
        },
      },
      projection: get,
    });
  }

  return await document.findOne({
    filters: { _id: documentId },
    projection: get,
  });
};
