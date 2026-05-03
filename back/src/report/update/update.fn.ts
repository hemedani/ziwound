import { type ActFn, ObjectId } from "lesan";
import { report } from "../../../mod.ts";

export const updateFn: ActFn = async (body) => {
  const {
    set: {
      _id,
      title,
      description,
      address,
      status,
      priority,
      selected_language,
      location,
    },
    get,
  } = body.details;

  const updateObj: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (title) updateObj.title = title;
  if (description) updateObj.description = description;
  if (address) updateObj.address = address;
  if (status) updateObj.status = status;
  if (priority) updateObj.priority = priority;
  if (selected_language) updateObj.selected_language = selected_language;
  if (location) updateObj.location = location;

  return await report.findOneAndUpdate({
    filter: { _id: new ObjectId(_id as string) },
    update: {
      $set: updateObj,
    },
    projection: get,
  });
};
