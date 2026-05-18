import { type ActFn, ObjectId } from "lesan";
import { warCriminal } from "../../../mod.ts";

export const updateFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      fullName,
      aliases,
      dateOfBirth,
      nationality,
      affiliation,
      rankOrPosition,
      knownFor,
      biography,
      description,
      status,
      convictionDetails,
      isEntity,
    },
    get,
  } = body.details;

  const updateObj: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (fullName !== undefined) updateObj.fullName = fullName;
  if (aliases !== undefined) updateObj.aliases = aliases;
  if (dateOfBirth !== undefined) updateObj.dateOfBirth = dateOfBirth;
  if (nationality !== undefined) updateObj.nationality = nationality;
  if (affiliation !== undefined) updateObj.affiliation = affiliation;
  if (rankOrPosition !== undefined) updateObj.rankOrPosition = rankOrPosition;
  if (knownFor !== undefined) updateObj.knownFor = knownFor;
  if (biography !== undefined) updateObj.biography = biography;
  if (description !== undefined) updateObj.description = description;
  if (status !== undefined) updateObj.status = status;
  if (convictionDetails !== undefined) updateObj.convictionDetails = convictionDetails;
  if (isEntity !== undefined) updateObj.isEntity = isEntity;

  return await warCriminal.findOneAndUpdate({
    filter: { _id: new ObjectId(_id as string) },
    update: {
      $set: updateObj,
    },
    projection: get,
  });
};
