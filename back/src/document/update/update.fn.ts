import { type ActFn, type Infer, object, ObjectId } from "lesan";
import { document } from "../../../mod.ts";
import { document_pure } from "@model";

export const updateFn: ActFn = async (body) => {
  const {
    set: { _id, ...rest },
    get,
  } = body.details;

  const pureStruct = object(document_pure);
  const updateObj: Partial<Infer<typeof pureStruct>> = {
    updatedAt: new Date(),
  };

  rest.title && (updateObj.title = rest.title);
  rest.description && (updateObj.description = rest.description);

  return await document.findOneAndUpdate({
    filter: { _id: new ObjectId(_id as string) },
    update: {
      $set: updateObj,
    },
    projection: get,
  });
};
