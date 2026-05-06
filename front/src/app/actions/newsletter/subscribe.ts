"use server";

import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function subscribeNewsletter(data: { email: string }) {
  try {
    newsletterSchema.parse(data);

    return {
      success: true,
      body: {
        message: "Subscribed successfully",
      },
    };
  } catch (error) {
    const message = error instanceof z.ZodError ? "Invalid email" : "Failed to subscribe";

    return {
      success: false,
      body: {
        message,
      },
    };
  }
}
