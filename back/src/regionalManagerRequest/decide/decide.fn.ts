import { type ActFn, ObjectId } from "lesan";
import {
  coreApp,
  regionalManagerRequest,
  user,
} from "../../../mod.ts";
import { throwError } from "@lib";
import type { MyContext } from "@lib";

const managedRelationNames = [
  "managesCountry",
  "managesProvince",
  "managesCity",
] as const;

const areaTypeToRelationName = (areaType: string) => {
  if (areaType === "Country") return "managesCountry" as const;
  if (areaType === "Province") return "managesProvince" as const;
  return "managesCity" as const;
};

export const decideFn: ActFn = async (body) => {
  const {
    set: { _id, decision, reviewNote },
    get,
  } = body.details;
  const { user: reviewer }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const requestId = new ObjectId(_id as string);

  const foundedRequest = await regionalManagerRequest.findOne({
    filters: { _id: requestId },
  });

  if (!foundedRequest) return throwError("Request not found");
  if (foundedRequest.status !== "Pending") {
    return throwError("Request has already been decided");
  }

  const targetUserId = foundedRequest.user?._id;
  if (!targetUserId) return throwError("Request has no applicant user");

  const relationName = areaTypeToRelationName(foundedRequest.areaType);
  const areaId =
    foundedRequest.country?._id ||
    foundedRequest.province?._id ||
    foundedRequest.city?._id;

  if (!areaId) return throwError("Request has no managed area");

  if (decision === "Approved") {
    const currentUser = await user.findOne({
      filters: { _id: new ObjectId(targetUserId) },
      projection: {
        managesCountry: 1,
        managesProvince: 1,
        managesCity: 1,
      },
    });

    for (const name of managedRelationNames) {
      const existingId = currentUser?.[name]?._id;
      if (!existingId) continue;
      if (name === relationName) continue;

      await user.removeRelation({
        filters: { _id: new ObjectId(targetUserId) },
        relations: {
          [name]: {
            _ids: existingId,
            relatedRelations: {
              regionalManagers: true,
            },
          },
        },
        projection: { _id: 1 },
      });
    }

    await user.findOneAndUpdate({
      filter: { _id: new ObjectId(targetUserId) },
      update: { $set: { isRegionalManager: true } },
      projection: { _id: 1 },
    });

    await user.addRelation({
      filters: { _id: new ObjectId(targetUserId) },
      relations: {
        [relationName]: {
          _ids: new ObjectId(areaId),
          relatedRelations: {
            regionalManagers: true,
          },
        },
      },
      projection: { _id: 1 },
      replace: true,
    });
  }

  await regionalManagerRequest.findOneAndUpdate({
    filter: { _id: requestId },
    update: {
      $set: {
        status: decision,
        reviewNote,
        decidedAt: new Date(),
      },
    },
    projection: { _id: 1 },
  });

  await regionalManagerRequest.addRelation({
    filters: { _id: requestId },
    relations: {
      reviewedBy: {
        _ids: reviewer._id,
      },
    },
    projection: { _id: 1 },
    replace: true,
  });

  return await regionalManagerRequest.findOne({
    filters: { _id: requestId },
    projection: get,
  });
};
