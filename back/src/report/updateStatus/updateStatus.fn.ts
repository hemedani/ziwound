import { type ActFn, ObjectId } from "lesan";
import { coreApp, report } from "../../../mod.ts";
import { assertReportInArea } from "../../../utils/regionalAccess.ts";
import type { MyContext } from "@lib";

export const updateStatusFn: ActFn = async (body) => {
  const {
    set: { _id, status, reviewNote },
    get,
  } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const reportId = new ObjectId(_id as string);

  await assertReportInArea(user, _id as string);

  const updateObj: Record<string, unknown> = {
    status,
    reviewedAt: new Date(),
    updatedAt: new Date(),
  };

  if (reviewNote !== undefined) updateObj.reviewNote = reviewNote;

  await report.findOneAndUpdate({
    filter: { _id: reportId },
    update: { $set: updateObj },
    projection: { _id: 1 },
  });

  return await report.addRelation({
    filters: { _id: reportId },
    relations: {
      reviewedBy: {
        _ids: user._id,
        relatedRelations: {
          reviewedReports: true,
        },
      },
    },
    projection: get,
    replace: true,
  });
};
