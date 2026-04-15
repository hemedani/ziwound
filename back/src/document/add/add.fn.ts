import { type ActFn, ObjectId } from "@deps";
import { document } from "../../../mod.ts";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;

  const { documentFiles, report, ...rest } = set;

  return await document.insertOne({
    doc: rest,
    relations: {
      documentFiles: documentFiles
        ? {
          _ids: documentFiles.map((id: string) => new ObjectId(id)),
        }
        : undefined,
      report: report
        ? {
          _ids: new ObjectId(report),
          relatedRelations: {
            documents: true,
          },
        }
        : undefined,
    },
    projection: get,
  });
};
