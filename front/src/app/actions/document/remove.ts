"use server";

import { AppApi } from "@/lib/api";
import { cookies } from "next/headers";
import { DeepPartial, ReqType } from "@/types/declarations";

export const remove = async (
  data: ReqType["main"]["document"]["remove"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["document"]["remove"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "document",
      act: "remove",
      details: {
        set: data,
        get: getSelection || {},
      },
    });

    return result;
  } catch (error: unknown) {
    return {
      success: false,
      body: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};
