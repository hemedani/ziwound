"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Share2,
  Link as LinkIcon,
  FileText,
  FileSpreadsheet,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { exportCSV } from "@/app/actions/report/export";

interface WarCrimesExportProps {
  searchParams?: Record<string, any>;
  locale: string;
}

export function WarCrimesExport({ searchParams, locale }: WarCrimesExportProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleShareLink = () => {
    if (typeof window === "undefined") return;

    navigator.clipboard.writeText(window.location.href);
    toast({
      title: t("common.copied") || "Link copied",
      description: t("warCrimes.linkCopiedDesc") || "The page link has been copied to your clipboard.",
    });
  };

  const handleSocialShare = (platform: "twitter" | "facebook" | "linkedin") => {
    if (typeof window === "undefined") return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(t("warCrimes.title") || "Ziwound - War Crimes Documentation");

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);

      const response = await exportCSV({
        ...searchParams,
      });

      if (response.success && response.body?.url) {
        window.open(response.body.url, "_blank");
      } else {
        throw new Error(response.body?.message || "Export failed");
      }
    } catch (error) {
      toast({
        title: t("common.error") || "Error",
        description: t("warCrimes.exportError") || "Failed to export data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            {t.has("common.share") ? t("common.share") : "Share"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t.has("warCrimes.sharePage") ? t("warCrimes.sharePage") : "Share Page"}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={handleShareLink} className="cursor-pointer gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>{t.has("common.copyLink") ? t("common.copyLink") : "Copy Link"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSocialShare("twitter")}
            className="cursor-pointer gap-2"
          >
            <Twitter className="h-4 w-4" />
            <span>Twitter / X</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSocialShare("facebook")}
            className="cursor-pointer gap-2"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSocialShare("linkedin")}
            className="cursor-pointer gap-2"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
            <Download className="h-4 w-4" />
            {t.has("common.export") ? t("common.export") : "Export"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t.has("warCrimes.exportData") ? t("warCrimes.exportData") : "Export Data"}
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleExportCSV}
            className="cursor-pointer gap-2"
            disabled={isExporting}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{t.has("warCrimes.exportCSV") ? t("warCrimes.exportCSV") : "Export CSV"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="cursor-pointer gap-2" title="Coming soon">
            <FileText className="h-4 w-4" />
            <span>
              {t.has("warCrimes.exportPDF") ? t("warCrimes.exportPDF") : "Export PDF (Coming Soon)"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
