import { type ActFn, ObjectId } from "lesan";
import { coreApp, regionalManagerRequest } from "../../../mod.ts";
import { throwError } from "@lib";
import type { MyContext } from "@lib";

export const getFn: ActFn = async (body) => {
  const {
    set: { _id },
    get,
  } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const requestId = new ObjectId(_id as string);

  const foundedRequest = await regionalManagerRequest.findOne({
    filters: { _id: requestId },
    projection: { user: 1, status: 1 },
  });

  if (!foundedRequest) return throwError("Request not found");

  const isManager = user.level === "Ghost" || user.level === "Manager";
  const isOwner = foundedRequest.user?._id?.toString() === user._id?.toString();

  if (!isManager && !isOwner) {
    throwError("You cant do this");
  }

  return await regionalManagerRequest.findOne({
    filters: { _id: requestId },
    projection: get,
  });
};
