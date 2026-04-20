"use server";

import { AppApi } from "@/lib/api";
import { ReqType, DeepPartial } from "@/types/declarations";
import { cookies } from "next/headers";

export const publish = async (
  _id: string,
  isPublished: boolean,
  getSelection?: DeepPartial<ReqType["main"]["blogPost"]["update"]["get"]>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "blogPost",
      act: "update",
      details: {
        set: {
          _id,
          isPublished,
          ...(isPublished ? { publishedAt: new Date().toISOString() } : {}),
        },
        get: getSelection || { _id: 1, isPublished: 1, publishedAt: 1 },
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
