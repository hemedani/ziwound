import { ObjectId } from "lesan";
import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const removeFn: ActFn = async (body) => {
  const { _id } = body.details.set;

  return await heroSlide.deleteOne({
    filter: { _id: new ObjectId(_id) },
    hardCascade: false,
  });
};

