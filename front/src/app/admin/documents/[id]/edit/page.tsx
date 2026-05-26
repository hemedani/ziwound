import { getTranslations } from "next-intl/server";
import { get as getDocument } from "@/app/actions/document/get";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentForm } from "../../_components/document-form";

const docProjection = {
  _id: 1,
  title: 1,
  description: 1,
  selected_language: 1,
  documentFiles: {
    _id: 1,
    name: 1,
    mimeType: 1,
    type: 1,
  },
} as const;

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const { id } = await params;

  const res = await getDocument({ _id: id }, docProjection);
  if (!res?.success || !res.body) notFound();

  const doc = Array.isArray(res.body) ? res.body[0] : res.body;

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10"
              asChild
            >
              <Link href={`/admin/documents/${id}`}>
                <ArrowLeft className="me-2 h-4 w-4" />
                {t("backToList") || "Back"}
              </Link>
            </Button>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-offwhite">
                {t("editDocument") || "Edit Document"}
              </h1>
              <p className="text-sm text-slate-body mt-1">
                {t("editDocumentDescription") ||
                  "Update document details and files"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          <DocumentForm initialData={doc} />
        </div>
      </div>
    </div>
  );
}
