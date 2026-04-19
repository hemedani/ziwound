import { getTranslations } from "next-intl/server";
import { get as getDocument } from "@/app/actions/document/get";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Edit, FileIcon, Calendar, Info } from "lucide-react";
import { getLesanBaseUrl } from "@/lib/api";

export default async function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("admin");
  const tCommon = await getTranslations("common");
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const response = await getDocument(
    { _id: id },
    {
      _id: 1,
      title: 1,
      description: 1,
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
      },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const documentData = response.body;
  const baseUrl = getLesanBaseUrl();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/documents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{documentData.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {t("createdAt") || "Created At"}: {new Date(documentData.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/documents/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              {t("edit")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t("details") || "Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">
                  {t("description") || "Description"}
                </h3>
                <p className="whitespace-pre-wrap">
                  {documentData.description || (
                    <span className="text-muted-foreground italic">
                      {tCommon("noDescription") || "No description provided."}
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileIcon className="h-5 w-5" />
                {t("files") || "Files"} ({(documentData.documentFiles || []).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documentData.documentFiles && documentData.documentFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documentData.documentFiles.map((file: any) => (
                    <a
                      key={file._id}
                      href={`${baseUrl}/file/download?id=${file._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-md">
                        <FileIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name || "Unnamed File"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {file.mimeType || "Unknown type"}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t("noFiles") || "No files attached to this document."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("linkedReports") || "Linked Reports"}</CardTitle>
            </CardHeader>
            <CardContent>
              {documentData.report && documentData.report.length > 0 ? (
                <div className="space-y-3">
                  {documentData.report.map((report: any) => (
                    <Link
                      key={report._id}
                      href={`/admin/reports/${report._id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium mb-1">{report.title}</div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {report.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.priority}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t("noLinkedReports") || "No reports linked to this document."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
