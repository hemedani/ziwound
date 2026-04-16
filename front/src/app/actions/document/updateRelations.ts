"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const updateRelations = async (
  data: ReqType["main"]["document"]["updateRelations"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["document"]["updateRelations"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "document",
      act: "updateRelations",
      details: {
        set: data,
        get: getSelection || {},
      },
    });

    return result;
  } catch (error: unknown) {
    return {
      success: false,
      body: { message: error instanceof Error ? error.message : "Unknown error" },
    };
  }
};
