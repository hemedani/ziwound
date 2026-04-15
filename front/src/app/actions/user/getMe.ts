"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const getMe = async (
  getSelection?: DeepPartial<ReqType["main"]["user"]["getMe"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, body: null, error: "Not authenticated" };
    }

    // Default selection if none is provided
    const defaultGet: DeepPartial<ReqType["main"]["user"]["getMe"]["get"]> = {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      level: 1,
      is_verified: 1,
    };

    const finalGetSelection = getSelection || defaultGet;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "user",
      act: "getMe",
      details: {
        set: {},
        get: finalGetSelection,
      },
    });

    if (!result.success) {
      return {
        success: false,
        body: null,
        error:
          result.body?.message ||
          result.error ||
          "Failed to fetch user profile",
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
