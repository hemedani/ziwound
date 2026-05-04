"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const get = async (
  data: ReqType["main"]["country"]["get"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["country"]["get"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "country",
      act: "get",
      details: {
        set: data,
        get: getSelection || {},
      },
    });

    return result;
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
