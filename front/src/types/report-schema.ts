import { z } from "zod";

export const REPORT_STATUS = ["Pending", "Approved", "Rejected", "InReview"] as const;

export const REPORT_PRIORITY = ["Low", "Medium", "High"] as const;

// Backend language codes with display names
export const LANGUAGE_MAP = {
  en: "English",
  zh: "Chinese",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  pa: "Punjabi",
  de: "German",
  id: "Indonesian",
  te: "Telugu",
  mr: "Marathi",
  tr: "Turkish",
  ta: "Tamil",
  vi: "Vietnamese",
  ko: "Korean",
  it: "Italian",
  fa: "Persian",
  nl: "Dutch",
  sv: "Swedish",
  pl: "Polish",
  uk: "Ukrainian",
  ro: "Romanian",
} as const;

export const REPORT_LANGUAGES = Object.keys(LANGUAGE_MAP) as unknown as readonly [
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
];

export type ReportStatus = (typeof REPORT_STATUS)[number];
export type ReportPriority = (typeof REPORT_PRIORITY)[number];
export type ReportLanguage = (typeof REPORT_LANGUAGES)[number];

const locationSchema = z.object({
  address: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const baseReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(10000, "Description must be less than 10000 characters"),
  selected_language: z.enum(REPORT_LANGUAGES, {
    required_error: "Language is required",
  }),
  crime_occurred_at: z.string().min(1, "Crime date is required"),
  address: z.string().optional(),
  hostileCountryIds: z.array(z.string()).optional(),
  attackedCountryIds: z.array(z.string()).optional(),
  attackedProvinceIds: z.array(z.string()).optional(),
  attackedCityIds: z.array(z.string()).optional(),
  location: locationSchema.optional(),
  status: z.enum(REPORT_STATUS).default("Pending"),
  priority: z.enum(REPORT_PRIORITY).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

export const reportFormSchema = baseReportSchema.refine(
  (data) => {
    if (data.location?.latitude && data.location?.longitude) {
      return data.location.latitude !== 0 || data.location.longitude !== 0;
    }
    return true;
  },
  {
    message: "Please select a valid location on the map",
    path: ["location"],
  },
);

export type ReportFormData = z.infer<typeof reportFormSchema>;

export const reportStepSchemas = {
  step1: baseReportSchema.pick({
    title: true,
    description: true,
    selected_language: true,
  }),
  step2: baseReportSchema.pick({
    crime_occurred_at: true,
    priority: true,
    tags: true,
    category: true,
  }),
  step3: baseReportSchema.pick({
    location: true,
    address: true,
    hostileCountryIds: true,
    attackedCountryIds: true,
    attackedProvinceIds: true,
    attackedCityIds: true,
  }),
  step4: baseReportSchema.pick({
    documents: true,
  }),
  step5: baseReportSchema,
};
