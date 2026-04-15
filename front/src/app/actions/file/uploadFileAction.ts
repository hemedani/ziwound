"use server";

import { getLesanUrl } from "@/lib/api";
import { cookies } from "next/headers";

export const uploadFileAction = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const url = getLesanUrl();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token ? { token } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return {
      success: false,
      body: { message: error instanceof Error ? error.message : "Unknown error" }
    };
  }
};
