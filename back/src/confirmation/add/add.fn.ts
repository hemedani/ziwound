import { type ActFn, ObjectId } from "lesan";
import { confirmation, coreApp, user } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;
  const { user: ctxUser }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const { reportId, supportingFileIds, ...rest } = set;

  const author = await user.findOne({
    filters: { _id: ctxUser._id },
    projection: { verificationBadge: 1, level: 1 } as unknown as Record<string, number>,
  });

  const badge = author?.verificationBadge || author?.level || "Ordinary";

  return await confirmation.insertOne({
    doc: { ...rest, badge },
    relations: {
      author: {
        _ids: ctxUser._id,
        relatedRelations: {
          confirmations: true,
        },
      },
      report: {
        _ids: new ObjectId(reportId),
        relatedRelations: {
          confirmations: true,
        },
      },
      supportingFiles: supportingFileIds
        ? {
          _ids: supportingFileIds.map((id: string) => new ObjectId(id)),
        }
        : undefined,
    },
    projection: get,
  });
};
