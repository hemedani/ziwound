import { z } from "zod";

export const REPORT_STATUS = [
  "Pending",
  "Approved",
  "Rejected",
  "InReview",
] as const;

export const REPORT_PRIORITY = ["Low", "Medium", "High"] as const;

export const REPORT_LANGUAGES = [
  "en",
  "zh",
  "hi",
  "es",
  "fr",
  "ar",
  "pt",
  "ru",
  "ja",
  "pa",
  "de",
  "id",
  "te",
  "mr",
  "tr",
  "ta",
  "vi",
  "ko",
  "it",
  "fa",
  "nl",
  "sv",
  "pl",
  "uk",
  "ro",
] as const;

export type ReportStatus = (typeof REPORT_STATUS)[number];
export type ReportPriority = (typeof REPORT_PRIORITY)[number];
export type ReportLanguage = (typeof REPORT_LANGUAGES)[number];

const locationSchema = z.object({
  type: z.literal("Point").default("Point"),
  coordinates: z.array(z.number()).length(2),
});

const baseReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(10000, "Description must be less than 10000 characters"),
  language: z.enum(REPORT_LANGUAGES, {
    required_error: "Language is required",
  }),
  crime_occurred_at: z.string().min(1, "Crime date is required"),
  address: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  location: locationSchema.optional(),
  status: z.enum(REPORT_STATUS).default("Pending"),
  priority: z.enum(REPORT_PRIORITY).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export const reportFormSchema = baseReportSchema.refine(
  (data) => {
    if (data.location?.coordinates) {
      return data.location.coordinates[0] !== 0 || data.location.coordinates[1] !== 0;
    }
    return true;
  },
  {
    message: "Please select a valid location on the map",
    path: ["location"],
  }
);

export type ReportFormData = z.infer<typeof reportFormSchema>;

export const reportStepSchemas = {
  step1: baseReportSchema.pick({
    title: true,
    description: true,
    language: true,
  }),
  step2: baseReportSchema.pick({
    crime_occurred_at: true,
    priority: true,
  }),
  step3: baseReportSchema.pick({
    location: true,
    address: true,
    country: true,
    city: true,
  }),
  step4: baseReportSchema.pick({
    attachments: true,
    tags: true,
    category: true,
  }),
  step5: baseReportSchema,
};