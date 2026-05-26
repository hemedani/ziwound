import { ObjectId } from "lesan";
import type { ActFn } from "lesan";
import { heroSlide } from "../../../mod.ts";

export const updateFn: ActFn = async (body) => {
  const { _id, image, ...rest } = body.details.set;

  // Parse boolean and number fields
  if (rest.isActive !== undefined) {
    rest.isActive = rest.isActive === "true" || rest.isActive === true;
  }
  if (rest.order !== undefined) {
    rest.order = Number(rest.order);
  }

  // Update pure fields
  const result = await heroSlide.findOneAndUpdate({
    filter: { _id: new ObjectId(_id) },
    update: { $set: { ...rest, updatedAt: new Date() } },
    projection: body.details.get,
  });

  // Update image relation if provided
  if (image !== undefined) {
    await heroSlide.addRelation({
      filters: { _id: new ObjectId(_id) },
      relations: {
        image: {
          _ids: new ObjectId(image),
        },
      },
      projection: body.details.get,
      replace: true,
    });
  }

  return result;
};
