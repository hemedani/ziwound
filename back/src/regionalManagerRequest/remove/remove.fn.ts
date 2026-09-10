import { type ActFn, ObjectId } from "lesan";
import { regionalManagerRequest, user } from "../../../mod.ts";
import { throwError } from "@lib";

const managedRelationNames = [
  "managesCountry",
  "managesProvince",
  "managesCity",
] as const;

const revokeAssignment = async (userId: ObjectId) => {
  const currentUser = await user.findOne({
    filters: { _id: userId },
    projection: {
      managesCountry: 1,
      managesProvince: 1,
      managesCity: 1,
    },
  });

  for (const name of managedRelationNames) {
    const existingId = currentUser?.[name]?._id;
    if (!existingId) continue;

    await user.removeRelation({
      filters: { _id: userId },
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
    filter: { _id: userId },
    update: { $set: { isRegionalManager: false } },
    projection: { _id: 1 },
  });
};

export const removeFn: ActFn = async (body) => {
  const {
    set: { _id },
  } = body.details;

  const requestId = new ObjectId(_id as string);

  const foundedRequest = await regionalManagerRequest.findOne({
    filters: { _id: requestId },
  });

  if (!foundedRequest) return throwError("Request not found");

  if (foundedRequest.status === "Approved" && foundedRequest.user?._id) {
    await revokeAssignment(new ObjectId(foundedRequest.user._id));
  }

  return await regionalManagerRequest.deleteOne({
    filter: { _id: requestId },
    hardCascade: false,
  });
};
