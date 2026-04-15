"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const login = async (
  data: ReqType["main"]["user"]["login"]["set"],
  getSelection?: DeepPartial<ReqType["main"]["user"]["login"]["get"]>,
) => {
  try {
    // Default selection if none is provided, ensuring we at least get the token
    // and basic user info needed by the frontend auth store.
    const defaultGet: DeepPartial<ReqType["main"]["user"]["login"]["get"]> = {
      token: 1,
      user: {
        _id: 1,
        first_name: 1,
        last_name: 1,
        email: 1,
        level: 1,
      },
    };

    const finalGetSelection = getSelection || defaultGet;

    const result = await AppApi().send({
      service: "main",
      model: "user",
      act: "login",
      details: {
        set: data,
        get: finalGetSelection,
      },
    });

    if (!result.success || !result.body?.token) {
      return {
        success: false,
        error: result.body?.message || result.error || "Invalid credentials",
      };
    }

    // Securely set the token in an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", result.body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 90 * 24 * 60 * 60, // 90 days
      path: "/",
    });

    return {
      success: true,
      body: result.body,
      user: result.body.user,
    };
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
