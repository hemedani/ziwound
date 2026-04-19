import { getTranslations } from "next-intl/server";
import { get as getDocument } from "@/app/actions/document/get";
import { DocumentForm } from "../../_components/document-form";
import { notFound } from "next/navigation";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const response = await getDocument(
    { _id: id },
    {
      _id: 1,
      title: 1,
      description: 1,
      documentFiles: {
        _id: 1,
        name: 1,
      },
    }
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const documentData = response.body;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("editDocument") || "Edit Document"}
        </h1>
        <p className="text-muted-foreground">
          {t("editDocumentDescription") || "Update document details and files"}
        </p>
      </div>
      <div className="max-w-2xl">
        <DocumentForm initialData={documentData} />
      </div>
    </div>
  );
}
