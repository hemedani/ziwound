import { type ActFn, ObjectId } from "lesan";
import { coreApp, report } from "../../../mod.ts";
import type { MyContext } from "@lib";

export const addFn: ActFn = async (body) => {
  const { set, get } = body.details;
  const { user }: MyContext = coreApp.contextFns
    .getContextModel() as unknown as MyContext;

  const { tags, category, documentIds, ...rest } = set;

  return await report.insertOne({
    doc: rest,
    relations: {
      reporter: {
        _ids: user._id,
      },
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
      documents: documentIds
        ? {
          _ids: documentIds.map((id: string) => new ObjectId(id)),
          relatedRelations: {
            report: true,
          },
        }
        : undefined,
    },
    projection: get,
  });
};
