import { FileText, Calendar, Globe, Clock, HardDrive, User } from "lucide-react";

interface DocumentMetadataProps {
  selectedLanguage?: string;
  createdAt?: string;
  updatedAt?: string;
  documentId?: string;
  fileCount: number;
  totalSize?: string;
  uploaderName?: string;
  translations: {
    documentDetails: string;
    documentId: string;
    language: string;
    createdAt: string;
    lastUpdated: string;
    files: string;
    totalSize: string;
    uploader: string;
  };
  languageNames: Record<string, string>;
}

function formatDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function DocumentMetadata({
  selectedLanguage,
  createdAt,
  updatedAt,
  documentId,
  fileCount,
  totalSize,
  uploaderName,
  translations,
  languageNames,
}: DocumentMetadataProps) {
  const rows = [
    {
      icon: Globe,
      label: translations.language,
      value: selectedLanguage
        ? (languageNames[selectedLanguage] || selectedLanguage)
        : "—",
    },
    {
      icon: Calendar,
      label: translations.createdAt,
      value: formatDate(createdAt, "en"),
    },
    {
      icon: Clock,
      label: translations.lastUpdated,
      value: formatDate(updatedAt, "en"),
    },
    {
      icon: FileText,
      label: translations.files,
      value: `${fileCount} ${fileCount === 1 ? "file" : "files"}`,
    },
    ...(totalSize
      ? [
          {
            icon: HardDrive,
            label: translations.totalSize,
            value: totalSize,
          },
        ]
      : []),
    ...(uploaderName
      ? [
          {
            icon: User,
            label: translations.uploader,
            value: uploaderName,
          },
        ]
      : []),
  ];

  if (documentId) {
    rows.unshift({
      icon: FileText,
      label: translations.documentId,
      value: documentId.length > 12 ? `${documentId.slice(0, 12)}...` : documentId,
    });
  }

  return (
    <div className="rounded-2xl glass-strong p-5 border border-white/[0.08]">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-white/5 rounded-lg p-1.5">
          <FileText className="h-4 w-4 text-gold" />
        </div>
        <h3 className="text-sm font-semibold text-offwhite">{translations.documentDetails}</h3>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0"
            >
              <div className="mt-0.5 bg-white/5 rounded-md p-1.5 shrink-0">
                <Icon className="h-3.5 w-3.5 text-slate-body/50" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-slate-body/50 mb-0.5">
                  {row.label}
                </p>
                <p className="text-sm font-medium text-offwhite truncate">{row.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
