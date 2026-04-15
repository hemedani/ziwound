import { type ActFn, ObjectId } from "@deps";
import { document } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, documentFiles, reportRelations },
    get,
  } = body.details;

  const documentId = new ObjectId(_id);

  if (documentFiles) {
    await document.addRelation({
      filters: { _id: documentId },
      relations: {
        documentFiles: {
          _ids: documentFiles.map((id: string) => new ObjectId(id)),
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (reportRelations) {
    await document.addRelation({
      filters: { _id: documentId },
      relations: {
        reportRelations: {
          _ids: reportRelations.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            documents: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  return await document.findOne({
    filters: { _id: documentId },
    projection: get,
  });
};
