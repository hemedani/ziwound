import { type ActFn, ObjectId } from "@deps";
import { document } from "../../../mod.ts";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;

  const { documentFiles, reportRelations, ...rest } = set;

  return await document.insertOne({
    doc: rest,
    relations: {
      documentFiles: documentFiles
        ? {
          _ids: documentFiles.map((id: string) => new ObjectId(id)),
        }
        : undefined,
      reportRelations: reportRelations
        ? {
          _ids: reportRelations.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            documents: true,
          },
        }
        : undefined,
    },
    projection: get,
  });
};
