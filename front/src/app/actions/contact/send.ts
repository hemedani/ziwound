"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Validate input
    const validatedData = contactSchema.parse(data);

    // TODO: Implement actual email sending logic here
    // For now, we'll simulate a successful submission
    // In production, you would integrate with:
    // - Email service (SendGrid, AWS SES, etc.)
    // - Database storage for contact messages
    // - Notification system for admin alerts

    console.log("Contact message received:", validatedData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data",
      };
    }

    console.error("Error sending contact message:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}
