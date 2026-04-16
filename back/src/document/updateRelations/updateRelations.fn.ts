import { type ActFn, ObjectId } from "@deps";
import { document } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, documentFiles, report, removeDocumentFiles },
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

  if (report) {
    await document.addRelation({
      filters: { _id: documentId },
      relations: {
        report: {
          _ids: new ObjectId(report),
          relatedRelations: {
            documents: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (removeDocumentFiles) {
    await document.removeRelation({
      filters: { _id: documentId },
      relations: {
        documentFiles: {
          _ids: removeDocumentFiles.map((id: string) => new ObjectId(id)),
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
