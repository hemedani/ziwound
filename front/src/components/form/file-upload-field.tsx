"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { uploadFileAction } from "@/app/actions/file/uploadFileAction";
import { getLesanBaseUrl } from "@/lib/api";

interface FileUploadFieldProps {
  label: string;
  description?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  onChange: (fileIds: string[]) => void;
  value?: string[];
  error?: string;
}

export function FileUploadField({
  label,
  description,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = "image/*,.pdf,.doc,.docx",
  onChange,
  value = [],
  error,
}: FileUploadFieldProps) {
  const t = useTranslations("common");
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; url?: string; type?: string; name: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync value prop with local state on initial load
  useEffect(() => {
    if (value && value.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles(
        value.map((id) => ({
          id,
          name: id, // We don't have the original name
          url: `${getLesanBaseUrl()}/uploads/images/${id}`, // Assuming image for preview, ideally we should know the type
        })),
      );
    }
  }, [value, uploadedFiles.length]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file size and count
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length + uploadedFiles.length > maxFiles) {
      // Too many files
      validFiles.splice(maxFiles - uploadedFiles.length);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newUploads = [...uploadedFiles];
      const newIds = [...value];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        // Determine type based on mime type
        let type = "doc";
        if (file.type.startsWith("image/")) type = "image";
        else if (file.type.startsWith("video/")) type = "video";

        const lesanBody = {
          service: "main",
          model: "file",
          act: "uploadFile",
          details: {
            set: { type },
            get: { _id: 1, name: 1, mimType: 1 },
          },
        };

        formData.append("lesan-body", JSON.stringify(lesanBody));

        const data = await uploadFileAction(formData);

        if (data.success && data.body && data.body._id) {
          const id = data.body._id;
          newIds.push(id);
          newUploads.push({
            id,
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
          });
        } else {
          console.error("Failed to upload file:", file.name, data);
        }
      }

      setUploadedFiles(newUploads);
      onChange(newIds);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);

    const newIds = [...value];
    newIds.splice(index, 1);
    onChange(newIds);
  };

  const isImage = (type?: string, url?: string) => {
    if (type) return type.startsWith("image/");
    if (url) return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
    return true; // Default to true if unknown, for backward compatibility
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary/50",
          error && "border-destructive hover:border-destructive/50",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        {isUploading ? (
          <Loader2 className="mx-auto h-8 w-8 text-muted-foreground animate-spin" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {isUploading ? (
            <span className="text-primary font-medium">{t("loading")}...</span>
          ) : (
            <span className="text-primary font-medium">{t("fileUpload.browse")}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t("fileUpload.maxFiles", { count: maxFiles })} ·{" "}
          {t("fileUpload.maxSize", { size: maxSize / (1024 * 1024) })}MB
        </p>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t("fileUpload.uploadedFiles", { count: uploadedFiles.length })}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                {isImage(file.type, file.url) ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      unoptimized
                      fill
                      src={file.url || `${getLesanBaseUrl()}/uploads/images/${file.id}`}
                      alt={file.name || "Uploaded image"}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <FileIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -end-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  type="button"
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="mt-1 text-xs truncate" title={file.name || file.id}>
                  {file.name || file.id}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
