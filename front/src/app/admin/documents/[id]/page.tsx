import { getTranslations } from "next-intl/server";
import { get as getDocument } from "@/app/actions/document/get";
import { notFound } from "next/navigation";
import { DocumentDetailClient } from "./document-detail-client";

const docProjection = {
  _id: 1,
  title: 1,
  description: 1,
  selected_language: 1,
  createdAt: 1,
  updatedAt: 1,
  documentFiles: {
    _id: 1,
    name: 1,
    mimeType: 1,
    type: 1,
  },
  report: {
    _id: 1,
    title: 1,
    status: 1,
    priority: 1,
    selected_language: 1,
  },
} as const;

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const { id } = await params;

  const res = await getDocument({ _id: id }, docProjection);
  if (!res?.success || !res.body) notFound();

  const doc = Array.isArray(res.body) ? res.body[0] : res.body;

  return <DocumentDetailClient doc={doc} docId={id} />;
}
