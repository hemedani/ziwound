"use server";
import { AppApi } from "@/lib/api";
import { ReqType } from "@/types/declarations";
import { cookies } from "next/headers";

export const remove = async (
  data: ReqType["main"]["heroSlide"]["remove"]["set"],
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "heroSlide",
      act: "remove",
      details: {
        set: data,
        get: {},
      },
    });

    return result;
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
