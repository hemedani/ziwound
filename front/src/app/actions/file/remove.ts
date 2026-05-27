"use server";
import { AppApi } from "@/lib/api";
import { cookies } from "next/headers";

export const remove = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "file",
      act: "remove",
      details: {
        set: { _id: id },
        get: { _id: 1 },
      },
    } as never);

    return result;
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
