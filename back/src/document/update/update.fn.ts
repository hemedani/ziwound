import { type ActFn, ObjectId } from "lesan";
import { document } from "../../../mod.ts";

export const updateFn: ActFn = async (body) => {
  const {
    set: { _id, title, description, selected_language },
    get,
  } = body.details;

  const updateObj: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (title) updateObj.title = title;
  if (description) updateObj.description = description;
  if (selected_language) updateObj.selected_language = selected_language;

  return await document.findOneAndUpdate({
    filter: { _id: new ObjectId(_id as string) },
    update: {
      $set: updateObj,
    },
    projection: get,
  });
};
