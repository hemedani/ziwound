export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFileTypeKey(mimeType?: string): string {
  if (!mimeType) return "unknown";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("document") || mimeType.includes("sheet") || mimeType.includes("presentation"))
    return "document";
  return "file";
}
