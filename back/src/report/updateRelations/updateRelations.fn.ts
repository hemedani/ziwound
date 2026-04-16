import { type ActFn, ObjectId } from "@deps";
import { coreApp, report } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, tags, category, documents, removeDocuments },
    get,
  } = body.details;

  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as MyContext;

  const reportId = new ObjectId(_id);

  if (tags) {
    await report.addRelation({
      filters: { _id: reportId },
      relations: {
        tags: {
          _ids: tags.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            reports: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (category) {
    await report.addRelation({
      filters: { _id: reportId },
      relations: {
        category: {
          _ids: new ObjectId(category),
          relatedRelations: {
            reports: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (documents) {
    await report.addRelation({
      filters: { _id: reportId },
      relations: {
        documents: {
          _ids: documents.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            report: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (removeDocuments) {
    await report.removeRelation({
      filters: { _id: reportId },
      relations: {
        documents: {
          _ids: removeDocuments.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            report: true,
          },
        },
      },
      projection: get,
    });
  }

  return await report.findOne({
    filters: { _id: reportId },
    projection: get,
  });
};
