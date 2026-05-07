import { ObjectId } from "lesan";
import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const getFn: ActFn = async (body) => {
  const { _id } = body.details.set;
  const { get } = body.details;

  return await heroSlide.findOne({
    filters: { _id: new ObjectId(_id) },
    projection: get,
  });
};
