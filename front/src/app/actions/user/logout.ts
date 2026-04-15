"use server";

import { cookies } from "next/headers";

export const logout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, body: { message: error instanceof Error ? error.message : "Unknown error" } };
  }
};
