"use client";

import React, { useState } from "react";
import { Plus, FileText, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadField } from "./file-upload-field";
import { REPORT_LANGUAGES } from "@/types/report-schema";
import { add as addDocumentAction } from "@/app/actions/document/add";
import type { ReqType } from "@/types/declarations";

interface DocumentFormFieldProps {
  value?: string[];
  onChange: (documentIds: string[]) => void;
  locale: string;
  error?: string;
}

interface NewDocumentForm {
  title: string;
  description: string;
  selected_language: string;
  files: string[];
}

export function DocumentFormField({ value = [], onChange, locale, error }: DocumentFormFieldProps) {
  const t = useTranslations("common");
  const tReport = useTranslations("report");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewDocumentForm>({
    title: "",
    description: "",
          selected_language: "",
    files: [],
  });
  const [validationError, setValidationError] = useState<string>("");

  const updateFormField = (field: keyof NewDocumentForm, fieldValue: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: fieldValue }));
    setValidationError("");
  };

  const handleAddDocument = async () => {
    setValidationError("");

    if (!formData.title.trim()) {
      setValidationError(tReport("documentTitleRequired"));
      return;
    }
    if (formData.files.length === 0) {
      setValidationError(tReport("filesRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addDocumentAction(
        {
          title: formData.title,
          description: formData.description || undefined,
          documentFileIds: formData.files,
        },
        { _id: 1 },
      );

      if (result.success && result.body && (result.body as { _id: string })._id) {
        const newDocId = (result.body as { _id: string })._id;
        onChange([...value, newDocId]);
        setIsDialogOpen(false);
        setFormData({
          title: "",
          description: "",
    selected_language: "",
          files: [],
        });
      } else {
        setValidationError(tReport("failedToCreateDocument"));
      }
    } catch (err) {
      setValidationError(tReport("failedToCreateDocument"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeDocument = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
            selected_language: "",
      files: [],
    });
    setValidationError("");
  };

  return (
    <div className="space-y-4">
      {value.map((docId, index) => (
        <div
          key={docId}
          className="border rounded-lg p-4 space-y-2 bg-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium text-sm">
                {tReport("document")} #{index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDocument(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">ID: {docId}</p>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {tReport("addDocument")}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{tReport("addNewDocument")}</DialogTitle>
            <DialogDescription>{tReport("addDocumentDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {tReport("documentTitle")} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.title}
                placeholder={tReport("documentTitlePlaceholder")}
                onChange={(e) => updateFormField("title", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{tReport("language")}</label>
                <Select
                  value={formData.selected_language}
                  onValueChange={(val) => updateFormField("selected_language", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tReport("languagePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{tReport("description")}</label>
              <Input
                value={formData.description}
                placeholder={tReport("documentDescriptionPlaceholder")}
                onChange={(e) => updateFormField("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {tReport("files")} <span className="text-destructive">*</span>
              </label>
              <FileUploadField
                label={tReport("files")}
                maxFiles={10}
                maxSize={10 * 1024 * 1024}
                accept="image/*,.pdf,.doc,.docx"
                value={formData.files}
                onChange={(files) => updateFormField("files", files)}
              />
            </div>

            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              {t("cancel")}
            </Button>
            <Button onClick={handleAddDocument} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}