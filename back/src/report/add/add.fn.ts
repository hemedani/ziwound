import { type ActFn, ObjectId } from "lesan";
import { coreApp, report } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const { tags, category, documentIds, hostileCountryIds, attackedCountryIds, attackedProvinceIds, attackedCityIds, ...rest } = set;

  return await report.insertOne({
    doc: rest,
    relations: {
      reporter: {
        _ids: user._id,
      },
      tags: tags
        ? {
          _ids: tags.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            reports: true,
          },
        }
        : undefined,
      category: category
        ? {
          _ids: new ObjectId(category),
          relatedRelations: {
            reports: true,
          },
        }
        : undefined,
      documents: documentIds
        ? {
          _ids: documentIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            report: true,
          },
        }
        : undefined,
      hostileCountries: hostileCountryIds
        ? {
          _ids: hostileCountryIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            hostileReports: true,
          },
        }
        : undefined,
      attackedCountries: attackedCountryIds
        ? {
          _ids: attackedCountryIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            attackedReports: true,
          },
        }
        : undefined,
      attackedProvinces: attackedProvinceIds
        ? {
          _ids: attackedProvinceIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            attackedByReports: true,
          },
        }
        : undefined,
      attackedCities: attackedCityIds
        ? {
          _ids: attackedCityIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            attackedByReports: true,
          },
        }
        : undefined,
    },
    projection: get,
  });
};
