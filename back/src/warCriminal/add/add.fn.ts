import { type ActFn, ObjectId } from "lesan";
import { warCriminal } from "../../../mod.ts";
import { throwError } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;

  const {
    tagIds,
    photoId,
    birthCountryId,
    birthCityId,
    residenceCountryId,
    residenceCityId,
    ...rest
  } = set;

  if (birthCountryId && birthCityId) {
    return throwError("Provide either birthCountryId or birthCityId, not both");
  }
  if (residenceCountryId && residenceCityId) {
    return throwError(
      "Provide either residenceCountryId or residenceCityId, not both",
    );
  }

  return await warCriminal.insertOne({
    doc: rest,
    relations: {
      tags: tagIds
        ? {
          _ids: tagIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            warCriminals: true,
          },
        }
        : undefined,
      photo: photoId
        ? {
          _ids: new ObjectId(photoId),
        }
        : undefined,
      birthCountry: birthCountryId
        ? {
          _ids: new ObjectId(birthCountryId),
        }
        : undefined,
      birthCity: birthCityId
        ? {
          _ids: new ObjectId(birthCityId),
        }
        : undefined,
      residenceCountry: residenceCountryId
        ? {
          _ids: new ObjectId(residenceCountryId),
        }
        : undefined,
      residenceCity: residenceCityId
        ? {
          _ids: new ObjectId(residenceCityId),
        }
        : undefined,
    },
    projection: get,
  });
};
