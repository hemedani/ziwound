"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const add = async (
  data: ReqType["main"]["regionalManagerRequest"]["add"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["regionalManagerRequest"]["add"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "regionalManagerRequest",
      act: "add",
      details: {
        set: data,
        get: getSelection || {},
      },
    });

    if (!result.success) {
      return {
        success: false,
        error: result.body?.message || result.error || "Request failed",
      };
    }

    return { success: true, body: result.body };
  } catch (error: unknown) {
    return {
      success: false,
      body: { message: error instanceof Error ? error.message : "Unknown error" },
    };
  }
};
