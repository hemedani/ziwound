"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";

export const registerUser = async (
  data: ReqType["main"]["user"]["registerUser"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["user"]["registerUser"]["get"]>,
) => {
  try {
    // Default selection if none is provided
    const defaultGet: DeepPartial<
      ReqType["main"]["user"]["registerUser"]["get"]
    > = {
      _id: 1,
    };

    const finalGetSelection = getSelection || defaultGet;

    const result = await AppApi().send({
      service: "main",
      model: "user",
      act: "registerUser",
      details: {
        set: data,
        get: finalGetSelection,
      },
    });

    if (!result.success) {
      return {
        success: false,
        error: result.body?.message || result.error || "Registration failed",
      };
    }

    return {
      success: true,
      body: result.body,
    };
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
