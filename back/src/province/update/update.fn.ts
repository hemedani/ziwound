import { type ActFn, type Infer, object, ObjectId } from "lesan";
import { province } from "../../../mod.ts";
import { province_pure } from "@model";

export const updateFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      name,
      area,

      english_name,
      center,
    },
    get,
  } = body.details;

  const pureStruct = object(province_pure);
  const updateObj: Partial<Infer<typeof pureStruct>> = {
    updatedAt: new Date(),
  };

  name && (updateObj.name = name);
  english_name && (updateObj.english_name = english_name);
  area && (updateObj.area = area);
  center && (updateObj.center = center);

  return await province.findOneAndUpdate({
    filter: { _id: new ObjectId(_id as string) },
    update: {
      $set: updateObj,
    },
    projection: get,
  });
};
