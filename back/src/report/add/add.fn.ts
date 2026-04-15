import { type ActFn, ObjectId } from "@deps";
import { coreApp, report } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as MyContext;

  const { attachments, tags, category, ...rest } = set;

  return await report.insertOne({
    doc: rest,
    relations: {
      reporter: {
        _ids: user._id,
      },
      attachments: attachments
        ? {
          _ids: attachments.map((id: string) => new ObjectId(id)),
        }
        : undefined,
      tags: tags
        ? {
          _ids: tags.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            reports: true,
          },
        }
        : undefined,
      category: category
        ? {
          _ids: new ObjectId(category),
          relatedRelations: {
            reports: true,
          },
        }
        : undefined,
    },
    projection: get,
  });
};
