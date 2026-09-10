import { type ActFn, ObjectId } from "lesan";
import { warCriminal } from "../../../mod.ts";
import { throwError } from "@lib";

export const updateRelationsFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      tagIds,
      tagIdsToRemove,
      photoId,
      birthCountryId,
      birthCityId,
      removeBirth,
      residenceCountryId,
      residenceCityId,
      removeResidence,
    },
    get,
  } = body.details;

  const warCriminalId = new ObjectId(_id);

  if (birthCountryId && birthCityId) {
    return throwError("Provide either birthCountryId or birthCityId, not both");
  }
  if (residenceCountryId && residenceCityId) {
    return throwError(
      "Provide either residenceCountryId or residenceCityId, not both",
    );
  }

  const current = await warCriminal.findOne({
    filters: { _id: warCriminalId },
    projection: {
      _id: 1,
      birthCountry: 1,
      birthCity: 1,
      residenceCountry: 1,
      residenceCity: 1,
    },
  });

  const removeSingleRelation = async (relationName: string) => {
    const relationId =
      (current as Record<string, { _id?: ObjectId }> | undefined)
        ?.[relationName]?._id;
    if (!relationId) return;
    await warCriminal.removeRelation({
      filters: { _id: warCriminalId },
      relations: {
        [relationName]: {
          _ids: relationId,
        },
      },
      projection: { _id: 1 },
    });
  };

  const addSingleRelation = async (
    relationName: string,
    relationId: ObjectId,
  ) => {
    await warCriminal.addRelation({
      filters: { _id: warCriminalId },
      relations: {
        [relationName]: {
          _ids: relationId,
        },
      },
      projection: { _id: 1 },
      replace: true,
    });
  };

  if (removeBirth) {
    await removeSingleRelation("birthCountry");
    await removeSingleRelation("birthCity");
  } else if (birthCountryId) {
    await removeSingleRelation("birthCity");
    await addSingleRelation("birthCountry", new ObjectId(birthCountryId));
  } else if (birthCityId) {
    await removeSingleRelation("birthCountry");
    await addSingleRelation("birthCity", new ObjectId(birthCityId));
  }

  if (removeResidence) {
    await removeSingleRelation("residenceCountry");
    await removeSingleRelation("residenceCity");
  } else if (residenceCountryId) {
    await removeSingleRelation("residenceCity");
    await addSingleRelation(
      "residenceCountry",
      new ObjectId(residenceCountryId),
    );
  } else if (residenceCityId) {
    await removeSingleRelation("residenceCountry");
    await addSingleRelation("residenceCity", new ObjectId(residenceCityId));
  }

  if (tagIds) {
    await warCriminal.addRelation({
      filters: { _id: warCriminalId },
      relations: {
        tags: {
          _ids: tagIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            warCriminals: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (tagIdsToRemove) {
    await warCriminal.removeRelation({
      filters: { _id: warCriminalId },
      relations: {
        tags: {
          _ids: tagIdsToRemove.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            warCriminals: true,
          },
        },
      },
      projection: get,
    });
  }

  if (photoId) {
    await warCriminal.addRelation({
      filters: { _id: warCriminalId },
      relations: {
        photo: {
          _ids: new ObjectId(photoId),
        },
      },
      projection: get,
      replace: true,
    });
  }

  return await warCriminal.findOne({
    filters: { _id: warCriminalId },
    projection: get,
  });
};
