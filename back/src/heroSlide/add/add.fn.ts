import { ObjectId } from "lesan";
import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const addFn: ActFn = async (body) => {
  const { image, ...rest } = body.details.set;

  // Parse boolean and number fields
  if (rest.isActive !== undefined) {
    rest.isActive = rest.isActive === "true" || rest.isActive === true;
  }
  if (rest.order !== undefined) {
    rest.order = Number(rest.order);
  }

  return await heroSlide.insertOne({
    doc: rest,
    relations: image
      ? {
        image: {
          _ids: new ObjectId(image),
        },
      }
      : undefined,

    projection: body.details.get,
  });
};
