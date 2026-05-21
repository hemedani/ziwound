import { type ActFn, ObjectId } from "lesan";
import { user } from "../../../mod.ts";

export const updateUserRelationsFn: ActFn = async (body) => {
  const {
    set: { _id, avatar, national_card, province, city, country },
    get,
  } = body.details;

  const modelId = new ObjectId(_id as string);

  if (avatar) {
    await user.addRelation({
      filters: { _id: modelId },
      relations: {
        avatar: {
          _ids: new ObjectId(avatar as string),
          relatedRelations: {},
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (national_card) {
    await user.addRelation({
      filters: { _id: modelId },
      relations: {
        national_card: {
          _ids: new ObjectId(national_card as string),
          relatedRelations: {},
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (province) {
    await user.addRelation({
      filters: { _id: modelId },
      relations: {
        province: {
          _ids: new ObjectId(province as string),
          relatedRelations: {
            users: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (city) {
    await user.addRelation({
      filters: { _id: modelId },
      relations: {
        city: {
          _ids: new ObjectId(city as string),
          relatedRelations: {
            users: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  if (country) {
    await user.addRelation({
      filters: { _id: modelId },
      relations: {
        country: {
          _ids: new ObjectId(country as string),
          relatedRelations: {
            users: true,
          },
        },
      },
      projection: get,
      replace: true,
    });
  }

  return await user.findOne({
    filters: { _id: modelId },
    projection: get,
  });
};
