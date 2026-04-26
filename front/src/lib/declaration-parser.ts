import type { ReportStatus, ReportPriority, ReportLanguage } from "@/types/report-schema";

export interface FieldMetadata {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object" | "enum";
  required: boolean;
  enumValues?: string[];
  nestedType?: string;
  description?: string;
}

export interface StepDefinition {
  step: number;
  title: string;
  description: string;
  fields: string[];
}

export interface DeclarationField {
  name: string;
  type: FieldMetadata["type"];
  required: boolean;
  enumValues?: readonly string[];
  nestedType?: string;
}

export const REPORT_FIELDS: DeclarationField[] = [
  { name: "title", type: "string", required: true },
  { name: "description", type: "string", required: true },
  { name: "language", type: "enum", required: true, enumValues: ["en", "zh", "hi", "es", "fr", "ar", "pt", "ru", "ja", "pa", "de", "id", "te", "mr", "tr", "ta", "vi", "ko", "it", "fa", "nl", "sv", "pl", "uk", "ro"] },
  { name: "crime_occurred_at", type: "date", required: true },
  { name: "country", type: "string", required: true },
  { name: "city", type: "string", required: false },
  { name: "address", type: "string", required: false },
  { name: "location", type: "object", required: false, nestedType: "Location" },
  { name: "status", type: "enum", required: false, enumValues: ["Pending", "Approved", "Rejected", "InReview"] },
  { name: "priority", type: "enum", required: false, enumValues: ["Low", "Medium", "High"] },
  { name: "tags", type: "array", required: false },
  { name: "category", type: "string", required: false },
  { name: "attachments", type: "array", required: false },
];

export const REPORT_STEPS: StepDefinition[] = [
  {
    step: 1,
    title: "Basic Information",
    description: "Enter the basic details about the incident",
    fields: ["title", "description", "language"],
  },
  {
    step: 2,
    title: "Crime Details",
    description: "When and how serious was the crime",
    fields: ["crime_occurred_at", "priority"],
  },
  {
    step: 3,
    title: "Location",
    description: "Where did the crime occur",
    fields: ["location", "address", "country", "city"],
  },
  {
    step: 4,
    title: "Media & Documents",
    description: "Upload evidence and supporting documents",
    fields: ["attachments", "tags", "category"],
  },
  {
    step: 5,
    title: "Review & Submit",
    description: "Review your report before submitting",
    fields: [],
  },
];

export function getFieldMetadata(fieldName: string): FieldMetadata | undefined {
  const field = REPORT_FIELDS.find((f) => f.name === fieldName);
  if (!field) return undefined;

  return {
    name: field.name,
    type: field.type,
    required: field.required,
    enumValues: field.enumValues as string[] | undefined,
  };
}

export function getStepFields(step: number): string[] {
  const stepDef = REPORT_STEPS.find((s) => s.step === step);
  return stepDef?.fields || [];
}

export function getAllStepFields(): StepDefinition[] {
  return REPORT_STEPS;
}

export type { ReportStatus, ReportPriority, ReportLanguage };