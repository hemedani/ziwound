import { type ActFn, ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, tags, category, documentIds, documentIdsToRemove },
    get,
  } = body.details;

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

  if (documentIds) {
    await report.addRelation({
      filters: { _id: reportId },
      relations: {
        documents: {
          _ids: documentIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            report: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (documentIdsToRemove) {
    await report.removeRelation({
      filters: { _id: reportId },
      relations: {
        documents: {
          _ids: documentIdsToRemove.map((id: string) => new ObjectId(id)),
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
