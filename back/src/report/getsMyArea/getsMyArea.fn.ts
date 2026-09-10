import type { ActFn, Document } from "lesan";
import { ObjectId } from "lesan";
import { coreApp, report } from "../../../mod.ts";
import {
  getReportAreaScope,
  isAdminLevel,
} from "../../../utils/regionalAccess.ts";
import type { MyContext } from "@lib";

export const getsMyAreaFn: ActFn = async (body) => {
  const {
    set: { page, limit, skip, status, search, sortBy, sortOrder },
    get,
  } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const pipeline: Document[] = [];

  if (!isAdminLevel(user)) {
    const scope = await getReportAreaScope(user._id);
    const orConditions: Document[] = [];

    if (scope.countryIds.length > 0) {
      orConditions.push({
        "attackedCountries._id": {
          $in: scope.countryIds.map((id: string) => new ObjectId(id)),
        },
      });
    }

    if (scope.provinceIds.length > 0) {
      orConditions.push({
        "attackedProvinces._id": {
          $in: scope.provinceIds.map((id: string) => new ObjectId(id)),
        },
      });
    }

    if (scope.cityIds.length > 0) {
      orConditions.push({
        "attackedCities._id": {
          $in: scope.cityIds.map((id: string) => new ObjectId(id)),
        },
      });
    }

    if (orConditions.length > 0) {
      pipeline.push({ $match: { $or: orConditions } });
    } else {
      return [];
    }
  }

  if (status) {
    pipeline.push({ $match: { status } });
  }

  if (search) {
    pipeline.push({ $match: { $text: { $search: search } } });
  }

  const sortField = sortBy || "_id";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: { [sortField]: sortDirection } });

  const calculatedSkip = skip ?? limit * (page - 1);
  pipeline.push({ $skip: calculatedSkip });
  pipeline.push({ $limit: limit });

  return await report
    .aggregation({
      pipeline,
      projection: { ...get, documents: 1 },
    })
    .toArray();
};
