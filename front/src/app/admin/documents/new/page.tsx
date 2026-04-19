import { getTranslations } from "next-intl/server";
import { DocumentForm } from "../_components/document-form";

export default async function NewDocumentPage() {
  const t = await getTranslations("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("addDocument")}</h1>
        <p className="text-muted-foreground">{t("addDocumentDescription")}</p>
      </div>
      <div className="max-w-2xl">
        <DocumentForm />
      </div>
    </div>
  );
}
