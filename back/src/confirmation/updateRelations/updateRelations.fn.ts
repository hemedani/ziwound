import { type ActFn, ObjectId } from "lesan";
import { confirmation } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      authorId,
      reportId,
      supportingFileIds,
      supportingFileIdsToRemove,
    },
    get,
  } = body.details;

  const confirmationId = new ObjectId(_id);

  if (authorId) {
    await confirmation.addRelation({
      filters: { _id: confirmationId },
      relations: {
        author: {
          _ids: new ObjectId(authorId),
          relatedRelations: {
            confirmations: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (reportId) {
    await confirmation.addRelation({
      filters: { _id: confirmationId },
      relations: {
        report: {
          _ids: new ObjectId(reportId),
          relatedRelations: {
            confirmations: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (supportingFileIds) {
    await confirmation.addRelation({
      filters: { _id: confirmationId },
      relations: {
        supportingFiles: {
          _ids: supportingFileIds.map((id: string) => new ObjectId(id)),
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (supportingFileIdsToRemove) {
    await confirmation.removeRelation({
      filters: { _id: confirmationId },
      relations: {
        supportingFiles: {
          _ids: supportingFileIdsToRemove.map((id: string) => new ObjectId(id)),
        },
      },
      projection: get,
    });
  }

  return await confirmation.findOne({
    filters: { _id: confirmationId },
    projection: get,
  });
};
