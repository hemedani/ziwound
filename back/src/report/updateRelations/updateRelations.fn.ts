import { type ActFn, ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, tags, category, documentIds, documentIdsToRemove, hostileCountryIds, hostileCountryIdsToRemove, attackedCountryIds, attackedCountryIdsToRemove },
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

  if (hostileCountryIds) {
    await report.addRelation({
      filters: { _id: reportId },
      relations: {
        hostileCountries: {
          _ids: hostileCountryIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            hostileReports: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (hostileCountryIdsToRemove) {
    await report.removeRelation({
      filters: { _id: reportId },
      relations: {
        hostileCountries: {
          _ids: hostileCountryIdsToRemove.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            hostileReports: true,
          },
        },
      },
      projection: get,
    });
  }

  if (attackedCountryIds) {
    await report.addRelation({
      filters: { _id: reportId },
      relations: {
        attackedCountries: {
          _ids: attackedCountryIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            attackedReports: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (attackedCountryIdsToRemove) {
    await report.removeRelation({
      filters: { _id: reportId },
      relations: {
        attackedCountries: {
          _ids: attackedCountryIdsToRemove.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            attackedReports: true,
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
