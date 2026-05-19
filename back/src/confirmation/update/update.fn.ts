import { type ActFn, ObjectId } from "lesan";
import { confirmation } from "../../../mod.ts";

export const updateFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      title,
      content,
      type,
      isVerified,
      selected_language,
    },
    get,
  } = body.details;

  const updateObj: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (title !== undefined) updateObj.title = title;
  if (content !== undefined) updateObj.content = content;
  if (type !== undefined) updateObj.type = type;
  if (isVerified !== undefined) updateObj.isVerified = isVerified;
  if (selected_language !== undefined) updateObj.selected_language = selected_language;

  return await confirmation.findOneAndUpdate({
    filter: { _id: new ObjectId(_id as string) },
    update: {
      $set: updateObj,
    },
    projection: get,
  });
};
