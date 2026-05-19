import { type ActFn, ObjectId } from "lesan";
import { confirmation } from "../../../mod.ts";

export const removeFn: ActFn = async (body) => {
  const {
    set: { _id, hardCascade },
  } = body.details;

  return await confirmation.deleteOne({
    filter: { _id: new ObjectId(_id as string) },
    hardCascade,
  });
};
